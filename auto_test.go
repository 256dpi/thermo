package thermo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTitle(t *testing.T) {
	assert.Equal(t, "Foo Bar", Title("FooBar"))
	assert.Equal(t, "Foo PDF", Title("FooPDF"))
	assert.Equal(t, "Redirect URIs", Title("RedirectURIs"))
	assert.Equal(t, "PDF", Title("PDF"))
	assert.Equal(t, "MD5", Title("MD5"))
	assert.Equal(t, "Some 3", Title("Some3"))
}
