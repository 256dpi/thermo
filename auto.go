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
		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// add to-one and has-one attributes
		if field.ToOne || field.HasOne {
			list = append(list, Attribute{
				Name: field.RelName,
				Kind: KindBelongsTo,
				Type: Type(field.RelType),
			})

			continue
		}

		// add to-many and has-many attributes
		if field.ToMany || field.HasMany {
			list = append(list, Attribute{
				Name: field.RelName,
				Kind: KindHasMany,
				Type: Type(field.RelType),
			})

			continue
		}

		// get type
		var typ Type
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

		// add attribute
		list = append(list, Attribute{
			Name: Key(field.JSONKey),
			Kind: KindValue,
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
		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// add to-one and has-one columns
		if field.ToOne || field.HasOne {
			list = append(list, Column{
				Title:  field.Name,
				Key:    field.RelName,
				Format: FormatBelongsTo,
				Label:  "id",
			})

			continue
		}

		// add to-many and has-many columns
		if field.ToMany || field.HasMany {
			list = append(list, Column{
				Title:  field.Name,
				Key:    field.RelName,
				Format: FormatHasMany,
				Label:  "id",
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
		// skip inaccessible fields
		if field.JSONKey == "" && field.RelType == "" {
			continue
		}

		// skip has-one and has-many relationships
		if field.HasOne || field.HasMany {
			continue
		}

		// add to-one fields
		if field.ToOne {
			continue // TODO: Add control.
		}

		// add to-many fields
		if field.ToMany {
			continue // TODO: Add control.
		}

		// get control
		var control Control
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

		// add field
		list = append(list, Field{
			Label:   field.Name,
			Key:     Key(field.JSONKey),
			Control: control,
		})
	}

	return list
}
