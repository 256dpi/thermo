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
				Name:      "user",
				Title:     "User",
				Sorting:   []string{"name:asc"},
				Watchable: true,
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
