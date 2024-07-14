.PHONY: up ps help down b seeder fmt

up:
	docker compose up -d

ps:
	docker compose ps

down:
	docker compose down

b:
	docker compose build

migr:
	docker compose exec php php spark migrate

seeder:
	docker compose exec php php spark db:seed UserSeeder
	docker compose exec php php spark db:seed RecipeSeeder

fmt:
	docker compose exec php composer format
	docker compose exec node npm run format
