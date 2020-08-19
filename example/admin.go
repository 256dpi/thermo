package main

import (
	"net/http"

	"github.com/256dpi/thermo"
)

func admin() http.Handler {
	return thermo.Build(thermo.Blueprint{
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
						Kind: thermo.Value,
						Type: thermo.String,
					},
					{
						Name:    "state",
						Kind:    thermo.Value,
						Type:    thermo.String,
						Default: true,
					},
					{
						Name: "count",
						Kind: thermo.Value,
						Type: thermo.Number,
					},
					{
						Name: "created",
						Kind: thermo.Value,
						Type: thermo.Date,
					},
					{
						Name: "updated",
						Kind: thermo.Value,
						Type: thermo.Date,
					},
					{
						Name: "deleted",
						Kind: thermo.Value,
						Type: thermo.Date,
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
						Title: "Name",
						Key:   "name",
					},
					{
						Title:  "State",
						Key:    "state",
						Format: thermo.FormatBoolean,
					},
					{
						Title: "Count",
						Key:   "count",
					},
					{
						Title:  "Created",
						Key:    "created",
						Format: thermo.FormatDate,
					},
					{
						Title:  "Updated",
						Key:    "updated",
						Format: thermo.FormatDate,
					},
					{
						Title:  "Deleted",
						Key:    "deleted",
						Format: thermo.FormatDate,
					},
				},
				Fields: []thermo.Field{
					{
						Name:        "name",
						Title:       "Name",
						Kind:        thermo.Value,
						Type:        thermo.String,
						Placeholder: "My Item",
					},
					{
						Name:    "state",
						Title:   "State",
						Kind:    thermo.Value,
						Type:    thermo.String,
						Default: true,
					},
					{
						Name:  "count",
						Title: "Count",
						Kind:  thermo.Value,
						Type:  thermo.Number,
					},
					{
						Name:  "created",
						Title: "Created",
						Kind:  thermo.Value,
						Type:  thermo.Date,
					},
					{
						Name:  "updated",
						Title: "Updated",
						Kind:  thermo.Value,
						Type:  thermo.Date,
					},
					{
						Name:  "deleted",
						Title: "Deleted",
						Kind:  thermo.Value,
						Type:  thermo.Date,
					},
				},
			},
			{
				Name:      "user",
				Title:     "User",
				Sorting:   []string{"name:asc"},
				Watchable: true,
				Attributes: []thermo.Attribute{
					{
						Name: "name",
						Kind: thermo.Value,
						Type: thermo.String,
					},
					{
						Name: "email",
						Kind: thermo.Value,
						Type: thermo.String,
					},
					{
						Name: "password",
						Kind: thermo.Value,
						Type: thermo.String,
					},
				},
				Properties: []thermo.Property{},
				Columns: []thermo.Column{
					{
						Title: "Name",
						Key:   "name",
					},
					{
						Title: "Email",
						Key:   "email",
					},
				},
				Fields: []thermo.Field{
					{
						Name:  "name",
						Title: "Name",
						Kind:  thermo.Value,
						Type:  thermo.String,
					},
					{
						Name:  "email",
						Title: "Email",
						Kind:  thermo.Value,
						Type:  thermo.String,
					},
					{
						Name:     "password",
						Title:    "Password",
						Kind:     thermo.Value,
						Type:     thermo.String,
						Redacted: true,
					},
				},
			},
		},
	})
}
