package main

import (
	"net/http"

	"github.com/256dpi/thermo"
)

func admin() http.Handler {
	return thermo.Build(thermo.Blueprint{
		Title:         "Example",
		APIBaseURL:    "http://0.0.0.0:8000",
		AuthNamespace: "auth",
		DataNamespace: "api",
		ClientID:      "main-key",
		Models: []thermo.Model{
			{
				Name:      "user",
				Title:     "User",
				Sorting:   []string{"name:asc"},
				Watchable: true,
				Fields: []thermo.Field{
					{
						Kind:  "value",
						Name:  "name",
						Title: "Name",
						Type:  "string",
					},
					{
						Kind:  "value",
						Name:  "email",
						Title: "Email",
						Type:  "string",
					},
				},
			},
		},
	})
}
