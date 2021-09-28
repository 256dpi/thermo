package thermo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTitle(t *testing.T) {
	assert.Equal(t, "Foo Bar", Title("FooBar"))
}
