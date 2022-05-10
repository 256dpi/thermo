package main

import (
	"encoding/json"
	"net/http"

	"github.com/256dpi/thermo"
)

var blueprint = thermo.Blueprint{
	Title: "Example",
	Color: "#30518d",
	Backend: thermo.Backend{
		BaseURL:      "http://0.0.0.0:8000",
		AuthPath:     "auth",
		AuthScope:    "foo",
		DataPath:     "api",
		WatchPath:    "api/watch",
		UploadPath:   "api/upload",
		DownloadPath: "api/download",
		ClientID:     "main-key",
	},
	Menus: []thermo.Menu{
		{
			Title: "App",
			Items: []thermo.MenuItem{
				{Title: "Items", Model: "item"},
				{Title: "Things", Model: "thing"},
			},
		},
		{
			Title: "Builtin",
			Items: []thermo.MenuItem{
				{Title: "Applications", Model: "application"},
				{Title: "Users", Model: "user"},
				{Title: "Tokens", Model: "token"},
				{Title: "Jobs", Model: "job"},
				{Title: "Values", Model: "value"},
				{Title: "Files", Model: "file"},
			},
		},
	},
	Models: []thermo.Model{
		{
			Name:      "item",
			Singular:  "Item",
			Plural:    "Items",
			Watchable: true,
			Creatable: true,
			Editable:  true,
			Deletable: true,
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
					Name: "subItems",
					Kind: thermo.KindValue,
				},
				{
					Name: "file",
					Kind: thermo.KindValue,
					Type: thermo.TypeFile,
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
			},
			Properties: []thermo.Property{
				{
					Name: "info",
					Keys: []string{"state"},
					Body: `return this.get('state') ? "Active" : "Inactive"`,
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
					Title:      "Count",
					Key:        "count",
					Format:     thermo.FormatExpression,
					Expression: `return this + " C";`,
				},
				{
					Title:  "Info",
					Key:    "info",
					Format: thermo.FormatLiteral,
				},
				{
					Title: "Raw",
					Key:   "raw",
				},
				{
					Title:  "File",
					Key:    "file",
					Format: thermo.FormatFile,
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
			},
			Actions: []thermo.Action{
				{
					Title:    "Activate",
					Disabled: `return this.state;`,
					Expression: `return async () => {
						this.state = true;
						await this.save();
					}`,
				},
				{
					Title: "Flip",
					Expression: `return async () => {
						this.state = !this.state;
						await this.save();
					}`,
				},
				{
					Title: "Add",
					Expression: `return () => {
						$.store.callResourceAction("POST", "item", this.id, "add", {});
					}`,
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
					Hint:    "Enables/Disables Count",
				},
				{
					Label:    "Count",
					Key:      "count",
					Control:  thermo.ControlNumber,
					Disabled: `return this.state`,
				},
				{
					Label:   "Foo",
					Key:     "name",
					Control: thermo.ControlSelect,
					Locked:  true,
					Options: []thermo.Option{
						{Value: "one", Label: "One"},
						{Value: "two", Label: "Two"},
						{Value: "three", Label: "Three"},
					},
				},
				{
					Label:  "Raw",
					Key:    "raw",
					Locked: true,
				},
				{
					Label:   "Name Again",
					Key:     "name",
					Control: thermo.ControlWell,
				},
				{
					Label:    "Sub Items",
					Key:      "subItems",
					Control:  thermo.ControlArray,
					ItemName: "Sub Item",
					ItemFields: []thermo.Field{
						{
							Label:   "Name",
							Key:     "name",
							Control: thermo.ControlString,
						},
						{
							Label:   "Scale",
							Key:     "scale",
							Control: thermo.ControlNumber,
						},
						{
							Label:    "Toggles",
							Key:      "toggles",
							Control:  thermo.ControlArray,
							ItemName: "Toggle",
							ItemFields: []thermo.Field{
								{
									Label:   "State",
									Key:     "state",
									Control: thermo.ControlBoolean,
								},
							},
						},
					},
					ItemFactory: `return { name: "Hello" }`,
				},
				{
					Label:       "File",
					Key:         "file",
					Control:     thermo.ControlFile,
					AcceptMedia: "image/png",
				},
			},
		},
		thermo.Auto(&thing{}, "thing", "Thing", "Things"),
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
