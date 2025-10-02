package thermo

import (
	"testing"
	"time"

	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/stick"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
)

type toggle struct {
	coal.ItemBase
	State bool `json:"state"`
}

type subItem struct {
	coal.ItemBase
	Name               string   `json:"name"`
	Scale              float64  `json:"scale"`
	Toggles            []toggle `json:"toggles"`
	stick.NoValidation `json:"-" bson:"-"`
}

type item struct {
	coal.Base          `json:"-" bson:",inline" coal:"items"`
	Name               string              `json:"name"`
	State              bool                `json:"state"`
	Count              int                 `json:"count"`
	Raw                bson.M              `json:"raw"`
	SubItems           coal.List[*subItem] `json:"sub-items"`
	File               *blaze.Link         `json:"file"`
	Color              string              `json:"color"`
	Created            time.Time           `json:"created" coal:"fire-created-timestamp"`
	Updated            time.Time           `json:"updated" coal:"fire-updated-timestamp"`
	stick.NoValidation `json:"-" bson:"-"`
}

func TestTitle(t *testing.T) {
	assert.Equal(t, "Foo Bar", Title("FooBar"))
	assert.Equal(t, "Foo PDF", Title("FooPDF"))
	assert.Equal(t, "Redirect URIs", Title("RedirectURIs"))
	assert.Equal(t, "PDF", Title("PDF"))
	assert.Equal(t, "MD5", Title("MD5"))
	assert.Equal(t, "Some 3", Title("Some3"))
}

func TestAuto(t *testing.T) {
	model := Auto(&item{}, "items", "Item", "Items", nil)
	assert.Equal(
		t,
		Model{
			Name:      "items",
			Singular:  "Item",
			Plural:    "Items",
			Creatable: true,
			Editable:  true,
			Deletable: true,
			Attributes: []Attribute{
				{
					Name:    "name",
					Kind:    "value",
					Type:    "string",
					Default: "",
				},
				{
					Name:    "state",
					Kind:    "value",
					Type:    "boolean",
					Default: false,
				},
				{
					Name:    "count",
					Kind:    "value",
					Type:    "number",
					Default: 0,
				},
				{
					Name: "raw",
					Kind: "value",
				},
				{
					Name: "sub-items",
					Kind: "value",
				},
				{
					Name: "file",
					Kind: "value",
					Type: "file",
				},
				{
					Name:    "color",
					Kind:    "value",
					Type:    "string",
					Default: "",
				},
				{
					Name: "created",
					Kind: "value",
					Type: "date",
				},
				{
					Name: "updated",
					Kind: "value",
					Type: "date",
				},
			},
			Columns: []Column{
				{
					Title:  "Name",
					Key:    "name",
					Format: "literal",
				},
				{
					Title:  "State",
					Key:    "state",
					Format: "literal",
				},
				{
					Title:  "Count",
					Key:    "count",
					Format: "literal",
				},
				{
					Title: "Raw",
					Key:   "raw",
				},
				{
					Title: "Sub Items",
					Key:   "sub-items",
				},
				{
					Title:  "File",
					Key:    "file",
					Format: "file",
				},
				{
					Title:  "Color",
					Key:    "color",
					Format: "literal",
				},
				{
					Title:  "Created",
					Key:    "created",
					Format: "absolute-date",
				},
				{
					Title:  "Updated",
					Key:    "updated",
					Format: "absolute-date",
				},
			},
			Fields: []Field{
				{
					Label:   "Name",
					Key:     "name",
					Control: "string",
				},
				{
					Label:   "State",
					Key:     "state",
					Control: "boolean",
				},
				{
					Label:   "Count",
					Key:     "count",
					Control: "number",
				},
				{
					Label: "Raw",
					Key:   "raw",
				},
				{
					Label:    "Sub Items",
					Key:      "sub-items",
					Control:  "array",
					ItemName: "Sub Items",
					ItemFields: []Field{
						{
							Label:   "Name",
							Key:     "name",
							Control: "string",
						},
						{
							Label:   "Scale",
							Key:     "scale",
							Control: "number",
						},
						{
							Label:    "Toggles",
							Key:      "toggles",
							Control:  "array",
							ItemName: "Toggles",
							ItemFields: []Field{
								{
									Label:   "State",
									Key:     "state",
									Control: "boolean",
								},
							},
						},
					},
				},
				{
					Label:   "File",
					Key:     "file",
					Control: "file",
				},
				{
					Label:   "Color",
					Key:     "color",
					Control: "string",
				},
				{
					Label:   "Created",
					Key:     "created",
					Control: "date",
				},
				{
					Label:   "Updated",
					Key:     "updated",
					Control: "date",
				},
			},
		},
		model,
	)
}
