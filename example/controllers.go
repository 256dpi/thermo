package main

import (
	"github.com/256dpi/fire"
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/flame"
	"github.com/256dpi/fire/glut"
)

func itemController(store *coal.Store, queue *axe.Queue, storage *blaze.Storage) *fire.Controller {
	return &fire.Controller{
		Model:   &Item{},
		Store:   store,
		Filters: []string{"Name", "State", "Count"},
		Sorters: []string{"Name", "State", "Count", "Created"},
		Authorizers: fire.L{
			flame.Callback(true),
		},
		Modifiers: fire.L{
			storage.Modifier(),
			fire.TimestampModifier(),
		},
		Validators: fire.L{
			fire.RelationshipValidator(&Item{}, catalog),
		},
		Decorators: fire.L{
			storage.Decorator(),
		},
		ResourceActions: fire.M{
			"add": queue.Action([]string{"POST"}, func(ctx *fire.Context) axe.Blueprint {
				return axe.Blueprint{
					Job: &incrementJob{
						Item: ctx.Model.ID(),
					},
				}
			}),
			"gen": queue.Action([]string{"POST"}, func(ctx *fire.Context) axe.Blueprint {
				return axe.Blueprint{
					Job: &generateJob{
						Item: ctx.Model.ID(),
					},
				}
			}),
		},
		IdempotentCreate: true,
		ConsistentUpdate: true,
		SoftDelete:       true,
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
			fire.RelationshipValidator(&flame.Application{}, catalog),
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
			fire.RelationshipValidator(&flame.User{}, catalog),
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
			fire.RelationshipValidator(&flame.Token{}, catalog),
		},
	}
}

func jobController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model:     &axe.Model{},
		Store:     store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}

func valueController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model:     &glut.Model{},
		Store:     store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}

func fileController(store *coal.Store) *fire.Controller {
	return &fire.Controller{
		Model:     &blaze.File{},
		Store:     store,
		Authorizers: fire.L{
			flame.Callback(true),
		},
	}
}
