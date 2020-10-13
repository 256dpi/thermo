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

// Jobs will return the model for managing axe.Model documents. It requires
// permission to watch documents.
func Jobs() Model {
	model := Auto(&axe.Model{}, "job", "Jobs")
	model.Watchable = true
	model.Immediate = true
	return model
}

// Values will return the model for managing glut.Model documents. It requires
// permission to watch documents.
func Values() Model {
	model := Auto(&glut.Model{}, "value", "Values")
	model.Watchable = true
	model.Immediate = true
	return model
}

// Files will return the model for managing blaze.File documents.
func Files() Model {
	return Auto(&blaze.File{}, "file", "Files")
}
