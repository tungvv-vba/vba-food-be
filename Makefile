BACKEND = food-backend
EXAMPLE_ENV = .env.example
ENV = .env

env:
	cp -f $(EXAMPLE_ENV) $(ENV)
up:
	docker compose up -d --build
down:
	docker compose down
reset:
	docker compose up -d $(BACKEND) --build --force-recreate 
