all: fmt vet lint

fmt:
	go fmt .
	go fmt ./example
	yarn fmt

vet:
	go vet .
	go vet ./example

lint:
	golint .
	golint ./example
	yarn lint:js
	yarn lint:hbs
