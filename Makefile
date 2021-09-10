check:
	go fmt .
	go fmt ./example
	yarn fmt
	go vet .
	go vet ./example
	golint .
	golint ./example
	yarn lint

build:
	yarn build

.PHONY: build
