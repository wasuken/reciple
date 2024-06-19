.PHONY: up ps help down b

up:
	docker compose up -d

ps:
	docker compose ps

down:
	docker compose down

b:
	docker compose build

