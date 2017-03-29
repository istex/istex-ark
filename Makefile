
.PHONY: build install

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := npm
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
    # use the rest as arguments for the command
    COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    # ...and turn them into do-nothing targets
    $(eval $(COMMAND_ARGS):;@:)
endif

install: ## install depedencies thanks to a dockerized npm install
	@docker run -it --rm -v $$(pwd):/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:6.9.1 npm install -q
	@make chown

build: ## build the docker istex/istex-ark image locally
	@docker build -t istex/istex-ark --build-arg http_proxy --build-arg https_proxy .

run-prod: ## run istex-ark in production mode
	@docker-compose -f ./docker-compose.yml up -d
	@docker attach istex-ark

run-debug: ## run istex-ark in debug mode (live regenerate the bundle.js if js are modified on fs)
	@docker-compose -f ./docker-compose.debug.yml up -d
	@# attach to the istex-ark container in order to be able to stop it easily with CTRL+C
	@docker attach istex-ark-ws

redis-cli: ## run redis client on the istex-ark-redis server
	@docker exec -it istex-ark-redis redis-cli

# makefile rule used to keep current user's unix rights on the docker mounted files
chown:
	@test ! -d $$(pwd)/node_modules || docker run -it --rm --net=host -v $$(pwd):/app node:6.9.1 chown -R $$(id -u):$$(id -g) /app/

npm: ## npm wrapper. example: make npm install --save mongodb-querystring
	@docker run -it --rm -v $$(pwd):/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:6.9.1 npm $(filter-out $@,$(MAKECMDGOALS))
	@make chown

lint: ## checks the coding rules (in a dockerized process)
	@docker run -it --rm -v $$(pwd):/app -w /app -e NODE_ENV -e http_proxy -e https_proxy node:6.9.1 npm lint
