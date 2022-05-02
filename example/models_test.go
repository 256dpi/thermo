package main

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/256dpi/fire/coal"
)

func TestEnsureIndexes(t *testing.T) {
	store := coal.MustOpen(nil, "example", nil)
	assert.NoError(t, catalog.EnsureIndexes(store))
	assert.NoError(t, catalog.EnsureIndexes(store))
}

func TestItem(t *testing.T) {
	coal.Require(&item{}, "fire-soft-delete")
	coal.Require(&item{}, "fire-created-timestamp", "fire-updated-timestamp")

	var _ coal.Model = &item{}
}
