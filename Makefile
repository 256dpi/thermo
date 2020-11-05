check:
	go fmt .
	go fmt ./example
	yarn fmt
	go vet .
	go vet ./example
	golint .
	golint ./example
	yarn lint:js
	yarn lint:hbs

build:
	yarn build
	go generate

.PHONY: build
