package thermo

import "github.com/256dpi/ember"

//go:generate go run github.com/256dpi/embed -strings -pkg thermo -name files -out files.go build/

// Blueprint configures a thermo application.
type Blueprint struct {
	Title   string  `json:"title"`
	Backend Backend `json:"backend"`
	Menu    Menu    `json:"menu"`
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

// Menu describes a menu.
type Menu struct {
	Left  []MenuItem `json:"left"`
	Right []MenuItem `json:"right"`
}

// MenuItem describes a menu item.
type MenuItem struct {
	Title string `json:"title"`
	Model string `json:"model"`
}

// Model describes a model.
type Model struct {
	Name       string      `json:"name"`
	Title      string      `json:"title"`
	Watchable  bool        `json:"watchable"`
	Immediate  bool        `json:"immediate"`
	Attributes []Attribute `json:"attributes"`
	Properties []Property  `json:"properties"`
	Orders     []Order     `json:"orders"`
	Filters    []Filter    `json:"filters"`
	Columns    []Column    `json:"columns"`
	Fields     []Field     `json:"fields"`
}

// Attribute describes a static model attribute.
type Attribute struct {
	Name    string     `json:"name"`
	Kind    Kind       `json:"kind"`
	Type    Type       `json:"type,omitempty"`
	Default Any        `json:"default,omitempty"`
	Init    Expression `json:"init,omitempty"`
}

// Property describes a dynamic model property.
type Property struct {
	Name string     `json:"name"`
	Keys []string   `json:"keys,omitempty"`
	Body Expression `json:"body,omitempty"`
}

// Order describes a sorting order.
type Order struct {
	Title string `json:"title"`
	Name  string `json:"name"`
}

// Filter describes a list filter.
type Filter struct {
	Title     string    `json:"title"`
	Key       string    `json:"key"`
	Condition Condition `json:"condition"`
}

// Column describes a table column.
type Column struct {
	Title  string `json:"title"`
	Key    string `json:"key"`
	Format Format `json:"format,omitempty"`
	Label  string `json:"label,omitempty"`
}

// Field describes a form field.
type Field struct {
	Label       string     `json:"label"`
	Key         string     `json:"key"`
	Hint        string     `json:"hint"`
	Control     Control    `json:"control"`
	Placeholder string     `json:"placeholder,omitempty"`
	Redacted    bool       `json:"redacted,omitempty"`
	Min         float64    `json:"min,omitempty"`
	Max         float64    `json:"max,omitempty"`
	Step        float64    `json:"step,omitempty"`
	Options     []Option   `json:"options,omitempty"`
	Source      Expression `json:"source,omitempty"`
	Multiple    bool       `json:"multiple,omitempty"`
	LabelKey    string     `json:"labelKey,omitempty"`
	EmptyLabel  string     `json:"emptyLabel,omitempty"`
	AllowEmpty  bool       `json:"allowEmpty,omitempty"`
}

// Option describes an option.
type Option struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

// Kind describes a field kind.
type Kind string

// The available field kinds.
const (
	KindValue     Kind = "value"
	KindBelongsTo Kind = "belongs-to"
	KindHasMany   Kind = "has-many"
)

// Type describes a field type.
type Type string

// The available field types.
const (
	TypeString  Type = "string"
	TypeBoolean Type = "boolean"
	TypeNumber  Type = "number"
	TypeDate    Type = "date"
)

// Condition describes a filter condition.
type Condition string

// The available filter conditions.
const (
	ConditionBoolean Condition = "boolean"
)

// Format describes a column format.
type Format string

// The available column formats.
const (
	FormatLiteral      Format = "literal"
	FormatBoolean      Format = "boolean"
	FormatAbsoluteDate Format = "absolute-date"
	FormatRelativeDate Format = "relative-date"
	FormatProgress     Format = "progress"
	FormatBelongsTo    Format = "belongs-to"
	FormatHasMany      Format = "has-many"
)

// Control describes a form control.
type Control string

// The available form controls.
const (
	ControlString    Control = "string"
	ControlText      Control = "text"
	ControlBoolean   Control = "boolean"
	ControlNumber    Control = "number"
	ControlDate      Control = "date"
	ControlSelect    Control = "select"
	ControlReference Control = "reference"
	ControlWell      Control = "well"
)

// Any describes an arbitrary value.
type Any = interface{}

// Expression describes a javascript expression.
type Expression string

// Build will build an ember app based on the provided blueprint.
func Build(blueprint Blueprint) *ember.App {
	app := ember.MustCreate("thermo", files)
	app.Set("blueprint", blueprint)
	return app
}
