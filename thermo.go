package thermo

import "github.com/256dpi/ember"

//go:generate embedfiles -strings -pkg thermo -name files -out files.go build/

// Blueprint configures a thermo application.
type Blueprint struct {
	Title   string  `json:"title"`
	Backend Backend `json:"backend"`
	Models  []Model `json:"models"`
}

// Backend describes the backend service.
type Backend struct {
	BaseURL   string `json:"baseURL"`
	AuthPath  string `json:"authPath"`
	DataPath  string `json:"dataPath"`
	WatchPath string `json:"watchPath"`
	ClientID  string `json:"clientID"`
}

// Model describes a model.
type Model struct {
	Name       string      `json:"name"`
	Title      string      `json:"title"`
	Sorting    []string    `json:"sorting"`
	Watchable  bool        `json:"watchable"`
	Attributes []Attribute `json:"attributes"`
	Properties []Property  `json:"properties"`
	Columns    []Column    `json:"columns"`
	Fields     []Field     `json:"fields"`
}

// Attribute describes a static model attribute.
type Attribute struct {
	Name    string `json:"name"`
	Kind    Kind   `json:"kind"`
	Type    Type   `json:"type"`
	Default Any    `json:"default"`
}

// Property describes a dynamic model property.
type Property struct {
	Name string   `json:"name"`
	Keys []string `json:"keys"`
	Body string   `json:"body"`
}

// Column describes a table column.
type Column struct {
	Title  string `json:"title"`
	Key    string `json:"key"`
	Format Format `json:"format"`
}

// Field describes a form field.
type Field struct {
	Name        string  `json:"name"`
	Title       string  `json:"title"`
	Type        Type    `json:"type"`
	Placeholder string  `json:"placeholder"`
	Redacted    bool    `json:"redacted"`
	Min         float64 `json:"min"`
	Max         float64 `json:"max"`
}

// Kind describes a field kind.
type Kind string

// The available field kinds.
const (
	Value     Kind = "value"
	BelongsTo Kind = "belongs-to"
	HasMany   Kind = "has-many"
)

// Type describes a field type.
type Type string

// The available field types.
const (
	String  Type = "string"
	Boolean Type = "boolean"
	Number  Type = "number"
	Date    Type = "date"
)

// Format describes a column format.
type Format string

// The available column formats.
const (
	FormatBoolean Format = "boolean"
	FormatDate    Format = "date"
)

// Any describes an arbitrary value.
type Any = interface{}

// Build will build an ember app based on the provided blueprint.
func Build(blueprint Blueprint) *ember.App {
	// create app
	app := ember.MustCreate("thermo", files)

	// set blueprint
	app.MustSet("blueprint", blueprint)

	return app
}
