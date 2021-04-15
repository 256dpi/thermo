package thermo

import (
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
)

// Applications will return the model for managing flame.Application documents.
func Applications() Model {
	return Auto(&flame.Application{}, "application", "Applications")
}

// Users will return the model for managing flame.User documents.
func Users() Model {
	return Auto(&flame.User{}, "user", "Users")
}

// Tokens will return the model for managing flame.Token documents.
func Tokens() Model {
	return Auto(&flame.Token{}, "token", "Tokens")
}

// Jobs will return the model for managing axe.Model documents. If live is true
// it requires permission to watch documents.
func Jobs(live bool) Model {
	return Modify(Auto(&axe.Model{}, "job", "Jobs"), func(model *Model) {
		model.Watchable = live
		model.Immediate = live
		for i, column := range model.Columns {
			if column.Key == "progress" {
				model.Columns[i].Format = FormatProgress
			}
		}
	})
}

// Values will return the model for managing glut.Model documents. If watch is
// true it requires permission to watch documents.
func Values(live bool) Model {
	return Modify(Auto(&glut.Model{}, "value", "Values"), func(model *Model) {
		model.Watchable = live
		model.Immediate = live
	})
}

// Files will return the model for managing blaze.File documents.
func Files() Model {
	return Auto(&blaze.File{}, "file", "Files")
}
