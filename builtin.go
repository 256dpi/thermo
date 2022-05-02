package thermo

import (
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
	"github.com/256dpi/fire/stick"
)

// Applications will return the model for managing flame.Application documents.
func Applications() Model {
	return Auto(&flame.Application{}, "application", "Applications")
}

// Users will return the model for managing flame.User documents.
func Users() Model {
	model := Auto(&flame.User{}, "user", "Users")
	for i, field := range model.Fields {
		if field.Key == "password" {
			model.Fields[i].Redacted = true
		}
	}
	return model
}

// Tokens will return the model for managing flame.Token documents.
func Tokens() Model {
	model := Auto(&flame.Token{}, "token", "Tokens")
	for i, column := range model.Columns {
		if stick.Contains([]string{"user", "application"}, column.Key) {
			model.Columns[i].Label = "name"
		}
	}
	for i, column := range model.Fields {
		if stick.Contains([]string{"user", "application"}, column.Key) {
			model.Fields[i].LabelKey = "name"
		}
	}
	return model
}

// Jobs will return the model for managing axe.Model documents. If live is true
// it requires permission to watch documents.
func Jobs(live bool) Model {
	model := Auto(&axe.Model{}, "job", "Jobs")
	model.Watchable = live
	model.Immediate = live
	for i, column := range model.Columns {
		if stick.Contains([]string{"created-at", "available-at", "started-at", "ended-at", "finished-at"}, column.Key) {
			model.Columns[i].Format = FormatRelativeDate
		}
		if column.Key == "progress" {
			model.Columns[i].Format = FormatProgress
		}
	}
	return model
}

// Values will return the model for managing glut.Model documents. If watch is
// true it requires permission to watch documents.
func Values(live bool) Model {
	model := Auto(&glut.Model{}, "value", "Values")
	model.Watchable = live
	model.Immediate = live
	return model
}

// Files will return the model for managing blaze.File documents.
func Files() Model {
	return Auto(&blaze.File{}, "file", "Files")
}
