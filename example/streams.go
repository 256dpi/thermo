package main

import (
	"github.com/256dpi/fire/axe"
	"github.com/256dpi/fire/blaze"
	"github.com/256dpi/fire/coal"
	"github.com/256dpi/fire/glut"
	"github.com/256dpi/fire/spark"
)

func itemStream(store *coal.Store) *spark.Stream {
	return &spark.Stream{
		Model:      &Item{},
		Store:      store,
		SoftDelete: true,
	}
}

func jobStream(store *coal.Store) *spark.Stream {
	return &spark.Stream{
		Model: &axe.Model{},
		Store: store,
	}
}

func valueStream(store *coal.Store) *spark.Stream {
	return &spark.Stream{
		Model: &glut.Model{},
		Store: store,
	}
}

func fileStream(store *coal.Store) *spark.Stream {
	return &spark.Stream{
		Model: &blaze.File{},
		Store: store,
	}
}
