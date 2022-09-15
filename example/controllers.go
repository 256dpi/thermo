package main

import (
	"github.com/256dpi/fire"
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
)

func itemController(store *coal.Store, queue *axe.Queue, bucket *blaze.Bucket) *fire.Controller {
	return &fire.Controller{
		Model:   &item{},
		Store:   store,
		Filters: []string{"Name", "State", "Count"},
		Sorters: []string{"Name", "State", "Count", "Created"},
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Modifiers: fire.L{
			bucket.Modifier(),
			fire.TimestampModifier("Created", "Updated"),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&item{}, models.All()),
		},
		Decorators: fire.L{
			bucket.Decorator(),
		},
		ResourceActions: fire.M{
			"add": queue.Action([]string{"POST"}, func(ctx *fire.Context) axe.Blueprint {
				return axe.Blueprint{
					Job: &incrementJob{
						Item: ctx.Model.ID(),
					},
				}
			}),
		},
	}
}

func thingController(store *coal.Store, bucket *blaze.Bucket) *fire.Controller {
	return &fire.Controller{
		Model: &thing{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Modifiers: fire.L{
			bucket.Modifier(),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&thing{}, models.All()),
		},
		Decorators: fire.L{
			bucket.Decorator(),
		},
	}
}

func applicationController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &flame.Application{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&flame.Application{}, models.All()),
		},
	}
}

func userController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &flame.User{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&flame.User{}, models.All()),
		},
	}
}

func tokenController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &flame.Token{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&flame.Token{}, models.All()),
		},
	}
}

func jobController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &axe.Model{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}

func valueController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &glut.Model{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}

func fileController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model: &blaze.File{},
		Store: store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}
