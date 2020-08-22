package thermo

import (
	"reflect"
	"time"

	"github.com/256dpi/fire/coal"
)

func unwrap(typ reflect.Type) reflect.Type {
	// check if pointer
	if typ.Kind() == reflect.Ptr {
		return typ.Elem()
	}

	return typ
}

// Key will return a model key that is conflict safe. It will use an titelized
// version of the key for conflicting keys.
func Key(name string) string {
	// check reserved
	if name == "data" {
		return "Data"
	} else if name == "errors" {
		return "Errors"
	}

	return name
}

// Auto will generate a Model definition for the provided coal.Model.
func Auto(model coal.Model, name, title string, sorting ...string) Model {
	// check sorting
	if len(sorting) == 0 {
		sorting = []string{"id:asc"}
	}

	return Model{
		Name:       name,
		Title:      title,
		Sorting:    sorting,
		Attributes: Attributes(model),
		Properties: []Property{},
		Columns:    Columns(model),
		Fields:     Fields(model),
	}
}

// Attributes will return a list of attributes for the provided coal.Model.
func Attributes(model coal.Model) []Attribute {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Attribute
	for _, field := range meta.OrderedFields {
		// check key
		if field.JSONKey == "" {
			continue
		}

		// get kind and type
		var kind Kind
		var typ Type
		if field.ToOne || field.HasOne {
			kind = KindBelongsTo
			typ = Type(field.RelType) // TODO: Singular?
		} else if field.ToMany || field.HasMany {
			kind = KindHasMany
			typ = Type(field.RelType) // TODO: Singular?
		} else {
			kind = KindValue
			switch unwrap(field.Type).Kind() {
			case reflect.String:
				typ = TypeString
			case reflect.Bool:
				typ = TypeBoolean
			case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32,
				reflect.Int64, reflect.Uint, reflect.Uint8, reflect.Uint16,
				reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64:
				typ = TypeNumber
			default:
				switch unwrap(field.Type) {
				case reflect.TypeOf(time.Time{}):
					typ = TypeDate
				}
			}
		}

		// add attribute
		list = append(list, Attribute{
			Name: Key(field.JSONKey),
			Kind: kind,
			Type: typ,
		})
	}

	return list
}

// Columns will return a list of columns for the provided coal.Model.
func Columns(model coal.Model) []Column {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Column
	for _, field := range meta.OrderedFields {
		// check key
		if field.JSONKey == "" {
			continue
		}

		// get format
		var format Format
		if field.ToOne || field.HasOne {
			// TODO: Add format.
		} else if field.ToMany || field.HasMany {
			// TODO: Add format.
		} else {
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
				}
			}
		}

		// add column
		list = append(list, Column{
			Title:  field.Name,
			Key:    Key(field.JSONKey),
			Format: format,
		})
	}

	return list
}

// Fields will return a list of fields for the provided coal.Model.
func Fields(model coal.Model) []Field {
	// get meta
	meta := coal.GetMeta(model)

	// collect
	var list []Field
	for _, field := range meta.OrderedFields {
		// check key
		if field.JSONKey == "" {
			continue
		}

		// check relationships
		if field.HasOne || field.HasMany {
			continue
		}

		// get kind and type
		var control Control
		if field.ToOne {
			// TODO: Add control.
		} else if field.ToMany {
			// TODO: Add control.
		} else {
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
				}
			}
		}

		// add field
		list = append(list, Field{
			Label:   field.Name,
			Key:     Key(field.JSONKey),
			Control: control,
		})
	}

	return list
}
