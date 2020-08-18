package main

import (
  "net/http"

  "github.com/256dpi/thermo"
)

func admin() http.Handler {
  return thermo.Build(thermo.Blueprint{})
}
