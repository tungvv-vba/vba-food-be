EXAMPLE_ENV = .env.example
ENV = .env

env:
	cp -f $(EXAMPLE_ENV) $(ENV)
up:
	docker compose up -d --build
down:
	docker compose down
