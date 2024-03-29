package thermo

import (
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
	"github.com/256dpi/fire/stick"
	"github.com/samber/lo"
)

// Applications will return the model for managing flame.Application documents.
// If confidential is true an attribute and column is added for a "confidential"
// property that maps to "IsConfidential".
func Applications(confidential bool) Model {
	// prepare model
	model := Auto(&flame.Application{}, "application", "Application", "Applications", nil)

	// remove secret column
	model.Columns = lo.Reject(model.Columns, func(c Column, _ int) bool {
		return c.Key == "secret"
	})

	// add confidential attribute and column if requested
	if confidential {
		model.Attributes = append(model.Attributes, Attribute{
			Name: "confidential",
			Kind: KindValue,
			Type: TypeBoolean,
		})
		model.Columns = append(model.Columns, Column{
			Title:  "Confidential",
			Key:    "confidential",
			Format: FormatBoolean,
		})
	}

	return model
}

// Users will return the model for managing flame.User documents.
func Users() Model {
	// prepare model
	model := Auto(&flame.User{}, "user", "User", "Users", nil)

	// remove password column
	model.Columns = lo.Reject(model.Columns, func(c Column, _ int) bool {
		return c.Key == "password"
	})

	// patch fields
	for i, field := range model.Fields {
		if field.Key == "password" {
			model.Fields[i].Redacted = true
		}
	}

	return model
}

// Tokens will return the model for managing flame.Token documents.
func Tokens() Model {
	// prepare access options
	accessOptions := []Option{
		{Value: string(flame.AccessToken), Label: "Access"},
		{Value: string(flame.RefreshToken), Label: "Refresh"},
	}

	// prepare model
	model := Auto(&flame.Token{}, "token", "Token", "Tokens", LabelKeys{
		&flame.Application{}: "Name",
		&flame.User{}:        "Name",
	})
	model.Creatable = false

	// patch columns
	for i, column := range model.Columns {
		if column.Key == "type" {
			model.Columns[i].Format = FormatMap
			model.Columns[i].Options = accessOptions
		} else if column.Key == "expires-at" {
			model.Columns[i].Format = FormatRelativeDate
		} else if stick.Contains([]string{"user", "application"}, column.Key) {
			model.Columns[i].LabelKey = "name"
		}
	}

	// patch fields
	for i, field := range model.Fields {
		if field.Key == "type" {
			model.Fields[i].Control = ControlSelect
			model.Fields[i].Options = accessOptions
		} else if stick.Contains([]string{"user", "application"}, field.Key) {
			model.Fields[i].LabelKey = "name"
		}
	}

	return model
}

// Jobs will return the model for managing axe.Model documents. If live is true
// it requires permission to watch documents.
func Jobs(live bool) Model {
	// prepare state options
	stateOptions := []Option{
		{Value: string(axe.Enqueued), Label: "Enqueued"},
		{Value: string(axe.Dequeued), Label: "Dequeued"},
		{Value: string(axe.Completed), Label: "Completed"},
		{Value: string(axe.Failed), Label: "Failed"},
		{Value: string(axe.Cancelled), Label: "Cancelled"},
	}

	// prepare model
	model := Auto(&axe.Model{}, "job", "Job", "Jobs", nil)
	model.Watchable = live
	model.Immediate = live
	model.Creatable = false

	// filter columns
	model.Columns = lo.Filter(model.Columns, func(column Column, _ int) bool {
		return column.Key != "events"
	})

	// patch columns
	for i, column := range model.Columns {
		if column.Key == "state" {
			model.Columns[i].Format = FormatMap
			model.Columns[i].Options = stateOptions
		} else if column.Key == "progress" {
			model.Columns[i].Format = FormatProgress
		} else if stick.Contains([]string{"created-at", "available-at", "started-at", "ended-at", "finished-at"}, column.Key) {
			model.Columns[i].Format = FormatRelativeDate
		}
	}

	// patch fields
	for i, field := range model.Fields {
		if field.Key == "state" {
			model.Fields[i].Control = ControlSelect
			model.Fields[i].Options = stateOptions
		}
	}

	return model
}

// Values will return the model for managing glut.Model documents. If watch is
// true it requires permission to watch documents.
func Values(live bool) Model {
	// prepare model
	model := Auto(&glut.Model{}, "value", "Value", "Values", nil)
	model.Watchable = live
	model.Immediate = live
	model.Creatable = false

	return model
}

// Files will return the model for managing blaze.File documents.
func Files() Model {
	// prepare state options
	stateOptions := []Option{
		{Value: string(blaze.Uploading), Label: "Uploading"},
		{Value: string(blaze.Uploaded), Label: "Uploaded"},
		{Value: string(blaze.Claimed), Label: "Claimed"},
		{Value: string(blaze.Released), Label: "Released"},
		{Value: string(blaze.Deleting), Label: "Deleting"},
	}

	// prepare model
	model := Auto(&blaze.File{}, "file", "File", "Files", nil)
	model.Creatable = false

	// patch columns
	for i, column := range model.Columns {
		if column.Key == "state" {
			model.Columns[i].Format = FormatMap
			model.Columns[i].Options = stateOptions
		}
	}

	// patch fields
	for i, field := range model.Fields {
		if field.Key == "state" {
			model.Fields[i].Control = ControlSelect
			model.Fields[i].Options = stateOptions
		}
	}

	return model
}
