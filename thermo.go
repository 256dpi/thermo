package thermo

import "github.com/256dpi/ember"

//go:generate embedfiles -strings -pkg thermo -name files -out files.go build/

// Blueprint configures a thermo application.
type Blueprint struct {
	Title         string  `json:"title"`
	APIBaseURL    string  `json:"apiBaseURL"`
	AuthNamespace string  `json:"authNamespace"`
	DataNamespace string  `json:"dataNamespace"`
	ClientID      string  `json:"clientID"`
	Models        []Model `json:"models"`
}

// Model describes a model.
type Model struct {
	Name      string   `json:"name"`
	Title     string   `json:"title"`
	Sorting   []string `json:"sorting"`
	Watchable bool     `json:"watchable"`
	Fields    []Field  `json:"fields"`
}

// Field describes a field.
type Field struct {
	Kind  string `json:"kind"`
	Name  string `json:"name"`
	Title string `json:"title"`
	Type  string `json:"type"`
}

// Build will build an ember app based on the provided blueprint.
func Build(blueprint Blueprint) *ember.App {
	// create app
	app := ember.MustCreate("thermo", files)

	// set blueprint
	app.MustSet("blueprint", blueprint)

	return app
}
