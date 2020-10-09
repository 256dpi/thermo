package thermo

import "github.com/256dpi/fire/axe"

// Jobs will return the model for managing axe.Model documents. It requires
// permission to watch documents.
func Jobs() Model {
	model := Auto(&axe.Model{}, "job", "Jobs")
	model.Watchable = true
	model.Immediate = true
	return model
}
