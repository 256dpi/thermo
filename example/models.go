package main

import (
	"time"
	"unicode/utf8"

	"github.com/256dpi/xo"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
)

var catalog = coal.NewCatalog(
	&item{},
	&thing{},
	&flame.Application{},
	&flame.User{},
	&flame.Token{},
	&axe.Model{},
	&glut.Model{},
	&blaze.File{},
)

var register = blaze.NewRegister()

func init() {
	// add item indexes
	catalog.AddIndex(&item{}, false, 0, "Name")

	// add item file binding
	register.Add(&blaze.Binding{
		Name:  "item-file",
		Owner: &item{},
		Field: "File",
		Types: []string{"image/png"},
	})

	// add thing binding
	register.Add(&blaze.Binding{
		Name:  "thing-file",
		Owner: &thing{},
		Field: "File",
	})

	// add system indexes
	flame.AddApplicationIndexes(catalog)
	flame.AddUserIndexes(catalog)
	flame.AddTokenIndexes(catalog, time.Minute)
	axe.AddModelIndexes(catalog, time.Second)
	glut.AddModelIndexes(catalog, time.Minute)
	blaze.AddFileIndexes(catalog)
}

type subItem struct {
	Name  string  `json:"name"`
	Scale float64 `json:"scale"`
}

type item struct {
	coal.Base `json:"-" bson:",inline" coal:"items"`
	Name      string      `json:"name"`
	State     bool        `json:"state"`
	Count     int         `json:"count"`
	Raw       bson.M      `json:"raw"`
	SubItems  []subItem   `json:"sub-items"`
	File      *blaze.Link `json:"file"`
	Created   time.Time   `json:"created" coal:"fire-created-timestamp"`
	Updated   time.Time   `json:"updated" coal:"fire-updated-timestamp"`
}

func (i *item) Validate() error {
	// check name
	if utf8.RuneCountInString(i.Name) < 1 {
		return xo.SF("missing name")
	}

	// check timestamps
	if i.Created.IsZero() || i.Updated.IsZero() {
		return xo.SF("missing timestamp")
	}

	// check file
	if i.File != nil {
		err := i.File.Validate(false)
		if err != nil {
			return err
		}
	}

	return nil
}

type thing struct {
	coal.Base `json:"-" bson:",inline" coal:"things"`
	String    string       `json:"string"`
	Boolean   bool         `json:"boolean"`
	Integer   int          `json:"integer"`
	Float     float64      `json:"float"`
	Bytes     []byte       `json:"bytes"`
	Time      time.Time    `json:"time"`
	Map       bson.M       `json:"map"`
	File      *blaze.Link  `json:"file"`
	One       *coal.ID     `json:"-" coal:"one:things"`
	Many      []coal.ID    `json:"-" coal:"many:things"`
	Ones      coal.HasMany `json:"-" coal:"ones:things:one"`
}

func (t *thing) Validate() error {
	// check file
	if t.File != nil {
		err := t.File.Validate(false)
		if err != nil {
			return err
		}
	}

	return nil
}
