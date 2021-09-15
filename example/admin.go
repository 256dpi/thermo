package main

import (
	"encoding/json"
	"net/http"

	"github.com/256dpi/thermo"
)

var blueprint = thermo.Blueprint{
	Title: "Example",
	Backend: thermo.Backend{
		BaseURL:   "http://0.0.0.0:8000",
		AuthPath:  "auth",
		AuthScope: "foo",
		DataPath:  "api",
		WatchPath: "api/watch",
		ClientID:  "main-key",
	},
	Menu: thermo.Menu{
		Left: []thermo.MenuItem{
			{Title: "Items", Model: "item"},
		},
		Right: []thermo.MenuItem{
			{Title: "Applications", Model: "application"},
			{Title: "Users", Model: "user"},
			{Title: "Tokens", Model: "token"},
			{Title: "Jobs", Model: "job"},
			{Title: "Values", Model: "value"},
			{Title: "Files", Model: "file"},
		},
	},
	Models: []thermo.Model{
		{
			Name:      "item",
			Title:     "Items",
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
					Name: "raw",
					Kind: thermo.KindValue,
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
			Orders: []thermo.Order{
				{
					Title: "Name",
					Name:  "name",
				},
				{
					Title: "State",
					Name:  "state",
				},
				{
					Title: "Count",
					Name:  "count",
				},
				{
					Title: "Created",
					Name:  "created",
				},
			},
			Filters: []thermo.Filter{
				{
					Title:     "State",
					Key:       "state",
					Condition: thermo.ConditionBoolean,
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
				{
					Label:   "Foo",
					Key:     "name",
					Control: thermo.ControlSelect,
					Options: []thermo.Option{
						{Value: "one", Label: "One"},
						{Value: "two", Label: "Two"},
						{Value: "three", Label: "Three"},
					},
				},
				{
					Label: "Raw",
					Key:   "raw",
				},
			},
		},
		thermo.Applications(),
		thermo.Users(),
		thermo.Tokens(),
		thermo.Jobs(true),
		thermo.Values(true),
		thermo.Files(),
	},
}

func admin() http.Handler {
	// build app
	app := thermo.MustBuild(blueprint)

	// serve blueprint for development
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/thermo.json" {
			_ = json.NewEncoder(w).Encode(blueprint)
		} else {
			app.ServeHTTP(w, r)
		}
	})
}
