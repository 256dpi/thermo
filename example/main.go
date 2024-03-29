package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/256dpi/fire/glut"
	"github.com/256dpi/lungo"
	"github.com/256dpi/oauth2/v2"
	"github.com/256dpi/serve"
	"github.com/256dpi/xo"

	"github.com/256dpi/fire"
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/heat"
	"github.com/256dpi/fire/spark"
)

var port = getEnv("PORT", "8000")
var mongoURI = getEnv("MONGODB_URI", "mongodb://localhost/thermo")
var secret = getEnv("SECRET", "abcd1234abcd1234")
var mainKey = getEnv("MAIN_KEY", "main-key")

func main() {
	// enable xo
	xo.Debug(xo.DebugConfig{})

	// visualize models
	err := coal.Visualize("Example", "models.pdf", models.All()...)
	if err != nil {
		panic(err)
	}

	// create store
	var store *coal.Store
	if mongoURI != "" {
		store = coal.MustConnect(mongoURI, func(err error) {
			panic(err)
		})
	} else {
		store = coal.MustOpen(nil, "example", func(err error) {
			panic(err)
		})
	}

	// prepare database
	err = prepareDatabase(store)
	if err != nil {
		panic(err)
	}

	// get port
	port, err := strconv.Atoi(port)
	if err != nil {
		panic(err)
	}

	// check secret
	if len(secret) < 16 {
		panic("secret must be at least 16 characters")
	}

	// prepare cors options
	corsOptions := serve.CORSPolicy{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"Origin", "Accept", "Content-Type",
			"Authorization", "Cache-Control", "X-Requested-With",
			"Content-Disposition"},
		AllowedMethods: []string{"GET", "POST", "PATCH", "DELETE"},
	}

	// compose handler
	handler := serve.Compose(
		serve.Recover(xo.Capture),
		serve.Throttle(100),
		serve.Timeout(time.Minute),
		serve.Limit(serve.MustByteSize("8M")),
		serve.CORS(corsOptions),
		flame.TokenMigrator(true),
		xo.RootHandler(),
		createHandler(store),
	)

	// run http server
	fmt.Printf("Running on http://0.0.0.0:%d\n", port)
	err = http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), handler)
	if err != nil {
		panic(err)
	}
}

func prepareDatabase(store *coal.Store) error {
	// ensure indexes
	err := coal.EnsureIndexes(store, models.All()...)
	if err != nil {
		return err
	}

	// ensure bucket indexes
	err = lungo.NewBucket(store.DB()).EnsureIndexes(nil, false)
	if err != nil {
		return err
	}

	// ensure first user
	err = flame.EnsureFirstUser(store, "User", "user@example.org", "user1234")
	if err != nil {
		return err
	}

	// ensure main application
	mainKey, err = flame.EnsureApplication(store, "Main", mainKey, "")
	if err != nil {
		return err
	}

	// log info
	fmt.Printf("==> Password for user@example.org: user1234\n")
	fmt.Printf("==> Main application key: %s\n", mainKey)

	return nil
}

func createHandler(store *coal.Store) http.Handler {
	// prepare master secret
	masterSecret := heat.Secret(secret)

	// derive secrets
	authSecret := masterSecret.Derive("auth")
	fileSecret := masterSecret.Derive("file")

	// create mux
	mux := http.NewServeMux()

	// create policy
	policy := flame.DefaultPolicy(heat.NewNotary("example/auth", authSecret))
	policy.Grants = flame.StaticGrants(true, true, true, true, true)
	policy.ApprovalURL = flame.StaticApprovalURL("http://0.0.0.0:4200/authorize")
	policy.GrantStrategy = func(_ *flame.Context, client flame.Client, owner flame.ResourceOwner, scope oauth2.Scope) (oauth2.Scope, error) {
		return scope, nil
	}
	policy.ApproveStrategy = func(_ *flame.Context, client flame.Client, owner flame.ResourceOwner, token flame.GenericToken, scope oauth2.Scope) (oauth2.Scope, error) {
		return scope, nil
	}

	// create authenticator
	a := flame.NewAuthenticator(store, policy, xo.Capture)

	// register authenticator
	mux.Handle("/auth/", a.Endpoint("/auth/"))

	// create watcher
	watcher := spark.NewWatcher(xo.Capture)
	for _, model := range []coal.Model{&item{}, &axe.Model{}, &glut.Model{}, &blaze.File{}} {
		watcher.Add(&spark.Stream{
			Model: model,
			Store: store,
		})
	}

	// create bucket
	fileNotary := heat.NewNotary("example/file", fileSecret)
	bucket := blaze.NewBucket(store, fileNotary, bindings.All()...)
	bucket.Use(blaze.NewGridFS(lungo.NewBucket(store.DB())), "local", true)

	// create queue
	queue := axe.NewQueue(axe.Options{
		Store:    store,
		Reporter: xo.Capture,
	})

	// add tasks
	queue.Add(incrementTask(store))
	queue.Add(periodicTask(store))
	queue.Add(bucket.CleanupTask(time.Minute, 100))

	// qun queue
	queue.Run()

	// create group
	g := fire.NewGroup(xo.Capture)

	// add controllers
	g.Add(itemController(store, queue, bucket))
	g.Add(thingController(store, bucket))
	g.Add(applicationController(store))
	g.Add(userController(store))
	g.Add(tokenController(store))
	g.Add(jobController(store))
	g.Add(valueController(store))
	g.Add(fileController(store))

	// add watch action
	g.Handle("watch", &fire.GroupAction{
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Action: watcher.Action(),
	})

	// add upload action
	g.Handle("upload", &fire.GroupAction{
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Action: bucket.UploadAction(serve.MustByteSize("16M"), 0),
	})

	// add download action
	g.Handle("download", &fire.GroupAction{
		Authorizers: fire.L{
			// public endpoint
		},
		Action: bucket.DownloadAction(0),
	})

	// register group
	mux.Handle("/api/", serve.Compose(
		a.Authorizer(nil, false, true, true),
		g.Endpoint("/api/"),
	))

	// register admin
	mux.Handle("/", admin())

	return mux
}

func getEnv(key, def string) string {
	v := os.Getenv(key)
	if v != "" {
		return v
	}

	return def
}
