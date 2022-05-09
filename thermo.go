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
	Menus   []Menu  `json:"menus"`
	Models  []Model `json:"models"`
}

// Backend describes the backend service.
type Backend struct {
	BaseURL      string `json:"baseURL"`
	AuthPath     string `json:"authPath"`
	AuthScope    string `json:"authScope"`
	DataPath     string `json:"dataPath"`
	WatchPath    string `json:"watchPath"`
	UploadPath   string `json:"uploadPath"`
	DownloadPath string `json:"downloadPath"`
	ClientID     string `json:"clientID"`
	UserDataKey  string `json:"userDataKey"`
	UserModel    string `json:"userModel"`
	UserNameKey  string `json:"userNameKey"`
}

// Menu describes a menu.
type Menu struct {
	Title string     `json:"title"`
	Items []MenuItem `json:"items"`
}

// MenuItem describes a menu item.
type MenuItem struct {
	Title string `json:"title"`
	Model string `json:"model"`
}

// Model describes a model.
type Model struct {
	Name       string      `json:"name"`
	Singular   string      `json:"singular"`
	Plural     string      `json:"plural"`
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
	Inverse string     `json:"inverse,omitempty"` // belongs-to, has-many
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
	Key        string     `json:"key,omitempty"` // leave empty for model based expression
	Format     Format     `json:"format,omitempty"`
	Options    []Option   `json:"options,omitempty"`    // map
	LabelKey   string     `json:"labelKey,omitempty"`   // belongs-to, has-many
	Expression Expression `json:"expression,omitempty"` // expression
}

// Action describes a row action.
type Action struct {
	Title      string     `json:"title"`
	Expression Expression `json:"expression"`
	Disabled   Expression `json:"disabled"`
}

// Field describes a form field.
type Field struct {
	Label       string     `json:"label"`
	Key         string     `json:"key"`
	Hint        string     `json:"hint"`
	Control     Control    `json:"control"`
	Disabled    Expression `json:"disabled,omitempty"`
	Locked      bool       `json:"locked,omitempty"`
	Placeholder string     `json:"placeholder,omitempty"` // string, text, number, date, undefined
	Redacted    bool       `json:"redacted,omitempty"`    // string
	Min         float64    `json:"min,omitempty"`         // number
	Max         float64    `json:"max,omitempty"`         // number
	Step        float64    `json:"step,omitempty"`        // number
	Options     []Option   `json:"options,omitempty"`     // select
	Source      Expression `json:"source,omitempty"`      // reference
	Multiple    bool       `json:"multiple,omitempty"`    // reference
	LabelKey    string     `json:"labelKey,omitempty"`    // reference
	EmptyLabel  string     `json:"emptyLabel,omitempty"`  // reference
	AllowEmpty  bool       `json:"allowEmpty,omitempty"`  // reference
	AcceptMedia string     `json:"acceptMedia,omitempty"` // file
	ItemName    string     `json:"itemName,omitempty"`    // array
	ItemFields  []Field    `json:"itemFields,omitempty"`  // array
	ItemFactory Expression `json:"itemFactory,omitempty"` // array
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
	KindFile      Kind = "file"
	KindFiles     Kind = "files"
)

// Type describes a field type.
type Type string

// The available field types.
const (
	TypeString  Type = "string"
	TypeBoolean Type = "boolean"
	TypeNumber  Type = "number"
	TypeDate    Type = "date"
	TypeStrings Type = "strings"
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
	FormatStrings      Format = "strings"
	FormatProgress     Format = "progress"
	FormatBelongsTo    Format = "belongs-to"
	FormatHasMany      Format = "has-many"
	FormatExpression   Format = "expression"
	FormatFile         Format = "file"
	FormatFiles        Format = "files"
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
	ControlStrings   Control = "strings"
	ControlSelect    Control = "select"
	ControlReference Control = "reference"
	ControlWell      Control = "well"
	ControlFile      Control = "file"
	ControlArray     Control = "array"
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
