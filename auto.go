package thermo

import (
	"reflect"
	"regexp"
	"strings"
	"time"

	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/stick"
)

func unwrap(typ reflect.Type) reflect.Type {
	// check if pointer
	if typ.Kind() == reflect.Ptr {
		return typ.Elem()
	}

	return typ
}

// Deconflict will return a model key that is conflict safe. It will use an
// titelized version of the key for conflicting keys.
func Deconflict(name string) string {
	// check reserved
	if name == "data" {
		return "Data"
	} else if name == "errors" {
		return "Errors"
	}

	return name
}

var titleRegexp = regexp.MustCompile(`[A-Z0-9]+[^A-Z0-9]*`)

// Title will convert a camel case name to a spaced title.
func Title(name string) string {
	// split
	segments := titleRegexp.FindAllString(name, -1)

	// build
	var builder strings.Builder
	for i, s := range segments {
		if i > 0 && (len(s) > 1 || len(segments[i-1]) > 1) {
			builder.WriteString(" ")
		}
		builder.WriteString(s)
	}

	return builder.String()
}

// LabelKeys is a mapping of models to label keys.
type LabelKeys map[coal.Model]string

// Get will return the label key for the specified relationship type name.
func (lk LabelKeys) Get(name string) string {
	// check model
	for model, label := range lk {
		meta := coal.GetMeta(model)
		if meta.PluralName == name {
			if field := meta.Fields[label]; field != nil {
				return field.JSONKey
			}
		}
	}

	return "id"
}

// Auto will generate a Model definition for the provided coal.Model.
func Auto(model coal.Model, name, singular, plural string, labelKeys LabelKeys, modifiers ...func(*Model)) Model {
	// prepare model
	m := Model{
		Name:       name,
		Singular:   singular,
		Plural:     plural,
		Creatable:  true,
		Editable:   true,
		Deletable:  true,
		Attributes: Attributes(model),
		Columns:    Columns(model, labelKeys),
		Fields:     Fields(model, labelKeys),
	}

	// run modifiers
	for _, modifier := range modifiers {
		modifier(&m)
	}

	return m
}

// Attributes will return a list of attributes for the provided coal.Model.
func Attributes(model coal.Model, only ...string) []Attribute {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Attribute
	for _, field := range meta.OrderedFields {
		// check if skipped
		if len(only) > 0 && !stick.Contains(only, field.Name) {
			continue
		}

		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// add to-one and has-one attributes
		if field.ToOne || field.HasOne {
			list = append(list, Attribute{
				Name:    field.RelName,
				Kind:    KindBelongsTo,
				Type:    Type(field.RelType),
				Inverse: field.RelInverse,
			})

			continue
		}

		// add to-many and has-many attributes
		if field.ToMany || field.HasMany {
			list = append(list, Attribute{
				Name:    field.RelName,
				Kind:    KindHasMany,
				Type:    Type(field.RelType),
				Inverse: field.RelInverse,
			})

			continue
		}

		// get type
		var typ Type
		var def Any
		switch unwrap(field.Type).Kind() {
		case reflect.String:
			typ = TypeString
			if !field.Optional {
				def = ""
			}
		case reflect.Bool:
			typ = TypeBoolean
			if !field.Optional {
				def = false
			}
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32,
			reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16,
			reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64:
			typ = TypeNumber
			if !field.Optional {
				def = 0
			}
		default:
			switch unwrap(field.Type) {
			case reflect.TypeOf(time.Time{}):
				typ = TypeDate
			case reflect.TypeOf([]string{}):
				typ = TypeStrings
			case reflect.TypeOf(blaze.Link{}):
				typ = TypeFile
			case reflect.TypeOf(blaze.Links{}):
				typ = TypeFiles
			}
		}

		// add attribute
		list = append(list, Attribute{
			Name:    Deconflict(field.JSONKey),
			Kind:    KindValue,
			Type:    typ,
			Default: def,
		})
	}

	return list
}

// Columns will return a list of columns for the provided coal.Model.
func Columns(model coal.Model, labelKeys LabelKeys, only ...string) []Column {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Column
	for _, field := range meta.OrderedFields {
		// check if skipped
		if len(only) > 0 && !stick.Contains(only, field.Name) {
			continue
		}

		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// add to-one and has-one columns
		if field.ToOne || field.HasOne {
			list = append(list, Column{
				Title:    Title(field.Name),
				Key:      field.RelName,
				Format:   FormatBelongsTo,
				LabelKey: labelKeys.Get(field.RelType),
			})

			continue
		}

		// add to-many and has-many columns
		if field.ToMany || field.HasMany {
			list = append(list, Column{
				Title:    Title(field.Name),
				Key:      field.RelName,
				Format:   FormatHasMany,
				LabelKey: labelKeys.Get(field.RelType),
			})

			continue
		}

		// get format
		var format Format
		switch unwrap(field.Type).Kind() {
		case reflect.String:
			format = FormatLiteral
		case reflect.Bool:
			format = FormatLiteral
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32,
			reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16,
			reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64:
			format = FormatLiteral
		default:
			switch unwrap(field.Type) {
			case reflect.TypeOf(time.Time{}):
				format = FormatAbsoluteDate
			case reflect.TypeOf([]string{}):
				format = FormatStrings
			case reflect.TypeOf(blaze.Link{}):
				format = FormatFile
			case reflect.TypeOf(blaze.Links{}):
				format = FormatFiles
			}
		}

		// add column
		list = append(list, Column{
			Title:  Title(field.Name),
			Key:    Deconflict(field.JSONKey),
			Format: format,
		})
	}

	return list
}

// Fields will return a list of fields for the provided coal.Model.
func Fields(model coal.Model, labelKeys LabelKeys, only ...string) []Field {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Field
	for _, field := range meta.OrderedFields {
		// check if skipped
		if len(only) > 0 && !stick.Contains(only, field.Name) {
			continue
		}

		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// skip has-one and has-many relationships
		if field.HasOne || field.HasMany {
			continue
		}

		// add to-one and to-many fields
		if field.ToOne || field.ToMany {
			list = append(list, Field{
				Label:   Title(field.Name),
				Key:     field.RelName,
				Control: ControlReference,
				Source: Expression(
					`return $.store.findAll($.singularize('` + field.RelType + `'))`,
				),
				Multiple:   field.ToMany,
				LabelKey:   labelKeys.Get(field.RelType),
				AllowEmpty: field.Optional,
			})

			continue
		}

		// get control
		var control Control
		var multiple bool
		switch unwrap(field.Type).Kind() {
		case reflect.String:
			control = ControlString
		case reflect.Bool:
			control = ControlBoolean
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32,
			reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16,
			reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64:
			control = ControlNumber
		default:
			switch unwrap(field.Type) {
			case reflect.TypeOf(time.Time{}):
				control = ControlDate
			case reflect.TypeOf([]string{}):
				control = ControlStrings
			case reflect.TypeOf(blaze.Link{}):
				control = ControlFile
			case reflect.TypeOf(blaze.Links{}):
				control = ControlFile
				multiple = true
			}
		}

		// add field
		list = append(list, Field{
			Label:    Title(field.Name),
			Key:      Deconflict(field.JSONKey),
			Control:  control,
			Multiple: multiple,
		})
	}

	return list
}
