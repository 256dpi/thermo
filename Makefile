all: fmt vet lint

fmt:
	go fmt .
	go fmt ./example

vet:
	go vet .
	go vet ./example

lint:
	golint .
	golint ./example
