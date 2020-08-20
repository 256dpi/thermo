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
						Kind: thermo.KindValue,
						Type: thermo.TypeString,
					},
					{
						Name:    "state",
						Kind:    thermo.KindValue,
						Type:    thermo.TypeString,
						Default: true,
					},
					{
						Name: "count",
						Kind: thermo.KindValue,
						Type: thermo.TypeNumber,
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
						Label:       "Name",
						Key:         "name",
						Control:     thermo.ControlString,
						Placeholder: "My Item",
					},
					{
						Label:   "State",
						Key:     "state",
						Control: thermo.ControlString,
					},
					{
						Label:   "Count",
						Key:     "count",
						Control: thermo.ControlNumber,
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
						Kind: thermo.KindValue,
						Type: thermo.TypeString,
					},
					{
						Name: "email",
						Kind: thermo.KindValue,
						Type: thermo.TypeString,
					},
					{
						Name: "password",
						Kind: thermo.KindValue,
						Type: thermo.TypeString,
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
						Label:   "Name",
						Key:     "name",
						Control: thermo.ControlString,
					},
					{
						Label:   "Email",
						Key:     "email",
						Control: thermo.ControlString,
					},
					{
						Label:    "Password",
						Key:      "password",
						Control:  thermo.ControlString,
						Redacted: true,
					},
				},
			},
		},
	})
}
