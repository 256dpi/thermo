package main

import (
	"encoding/json"
	"net/http"

	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"

	"github.com/256dpi/thermo"
)

var blueprint = thermo.Blueprint{
	Title: "Example",
	Backend: thermo.Backend{
		BaseURL:   "http://0.0.0.0:8000",
		AuthPath:  "auth",
		DataPath:  "api",
		WatchPath: "api/watch",
		ClientID:  "main-key",
	},
	Models: []thermo.Model{
		{
			Name:      "item",
			Title:     "Item",
			Sorting:   []string{"name:asc"},
			Watchable: true,
			Attributes: []thermo.Attribute{
				{
					Name: "name",
					Kind: thermo.KindValue,
					Type: thermo.TypeString,
				},
				{
					Name:    "state",
					Kind:    thermo.KindValue,
					Type:    thermo.TypeBoolean,
					Default: true,
				},
				{
					Name:    "count",
					Kind:    thermo.KindValue,
					Type:    thermo.TypeNumber,
					Default: 0,
				},
				{
					Name: "created",
					Kind: thermo.KindValue,
					Type: thermo.TypeDate,
				},
				{
					Name: "updated",
					Kind: thermo.KindValue,
					Type: thermo.TypeDate,
				},
				{
					Name: "deleted",
					Kind: thermo.KindValue,
					Type: thermo.TypeDate,
				},
				{
					Name: "create-token",
					Kind: thermo.KindValue,
					Type: thermo.TypeString,
					Init: "Date.now().toString()",
				},
				{
					Name: "update-token",
					Kind: thermo.KindValue,
					Type: thermo.TypeString,
				},
			},
			Properties: []thermo.Property{
				{
					Name: "info",
					Keys: []string{"state"},
					Body: `this.get('state') ? "Active" : "Inactive"`,
				},
			},
			Columns: []thermo.Column{
				{
					Title:  "Name",
					Key:    "name",
					Format: thermo.FormatLiteral,
				},
				{
					Title:  "State",
					Key:    "state",
					Format: thermo.FormatBoolean,
				},
				{
					Title:  "Count",
					Key:    "count",
					Format: thermo.FormatLiteral,
				},
				{
					Title:  "Info",
					Key:    "info",
					Format: thermo.FormatLiteral,
				},
				{
					Title:  "Created",
					Key:    "created",
					Format: thermo.FormatAbsoluteDate,
				},
				{
					Title:  "Updated",
					Key:    "updated",
					Format: thermo.FormatRelativeDate,
				},
				{
					Title:  "Deleted",
					Key:    "deleted",
					Format: thermo.FormatAbsoluteDate,
				},
			},
			Fields: []thermo.Field{
				{
					Label:       "Name",
					Key:         "name",
					Control:     thermo.ControlString,
					Placeholder: "My Item",
				},
				{
					Label:   "State",
					Key:     "state",
					Control: thermo.ControlBoolean,
				},
				{
					Label:   "Count",
					Key:     "count",
					Control: thermo.ControlNumber,
				},
			},
		},
		thermo.Auto(&flame.Application{}, "application", "Applications"),
		thermo.Auto(&flame.User{}, "user", "Users"),
		thermo.Auto(&flame.Token{}, "token", "Tokens"),
		thermo.Auto(&axe.Model{}, "job", "Jobs"),
		thermo.Auto(&glut.Model{}, "value", "Values"),
		thermo.Auto(&blaze.File{}, "file", "Files"),
	},
}

func admin() http.Handler {
	// build app
	app := thermo.Build(blueprint)

	// serve blueprint for development
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/thermo.json" {
			_ = json.NewEncoder(w).Encode(blueprint)
		} else {
			app.ServeHTTP(w, r)
		}
	})
}
