package thermo

import (
	"embed"
	"encoding/json"

	"github.com/256dpi/ember"
)

//go:embed build
var build embed.FS

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
	AuthScope string `json:"authScope"`
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
	ListOnly   bool        `json:"listOnly"`
	Attributes []Attribute `json:"attributes"`
	Properties []Property  `json:"properties"`
	Orders     []Order     `json:"orders"`
	Filters    []Filter    `json:"filters"`
	Columns    []Column    `json:"columns"`
	Actions    []Action    `json:"actions"`
	Fields     []Field     `json:"fields"`
}

// Attribute describes a static model attribute.
type Attribute struct {
	Name    string     `json:"name"`
	Kind    Kind       `json:"kind"`
	Type    Type       `json:"type,omitempty"`
	Inverse string     `json:"inverse,omitempty"`
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
	Title      string     `json:"title"`
	Key        string     `json:"key"`
	Format     Format     `json:"format,omitempty"`
	Options    []Option   `json:"options,omitempty"`
	Label      string     `json:"label,omitempty"`
	Expression Expression `json:"expression,omitempty"`
}

// Action describes a row action.
type Action struct {
	Title      string     `json:"title"`
	Expression Expression `json:"expression"`
}

// Field describes a form field.
type Field struct {
	Label       string     `json:"label"`
	Key         string     `json:"key"`
	Hint        string     `json:"hint"`
	Control     Control    `json:"control"`
	Disabled    bool       `json:"disabled,omitempty"`
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
	FormatMap          Format = "map"
	FormatAbsoluteDate Format = "absolute-date"
	FormatRelativeDate Format = "relative-date"
	FormatProgress     Format = "progress"
	FormatBelongsTo    Format = "belongs-to"
	FormatHasMany      Format = "has-many"
	FormatExpression   Format = "expression"
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

// Expression describes a javascript expression. The current value can be
// accessed using `this`, the special variable `$` allows access to the context
// service.
type Expression string

// Constant creates and expression that returns the provided constant value.
func Constant(value interface{}) Expression {
	buf, err := json.Marshal(value)
	if err != nil {
		panic(err)
	}
	return Expression(`return ` + string(buf) + `;`)
}

// Build will build an ember app based on the provided blueprint.
func Build(blueprint Blueprint) (*ember.App, error) {
	// get files
	files, err := ember.Files(build, "build")
	if err != nil {
		return nil, err
	}

	// create app
	app := ember.MustCreate("thermo", files)
	app.Set("blueprint", blueprint)

	return app, nil
}

// MustBuild will call Build and panic on error.
func MustBuild(blueprint Blueprint) *ember.App {
	// build app
	app, err := Build(blueprint)
	if err != nil {
		panic(err)
	}

	return app
}
