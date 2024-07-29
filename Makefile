.PHONY: up ps help down b seeder fmt

test:
	docker compose exec php composer test

up:
	docker compose up -d

ps:
	docker compose ps

down:
	docker compose down

b:
	docker compose build

init_migr_sdr: init migr seeder

init:
	docker compose exec php php spark migrate:refresh

migr:
	docker compose exec php php spark migrate

seeder:
	docker compose exec php php spark db:seed UserSeeder
	docker compose exec php php spark db:seed RecipeSeeder

fmt:
	docker compose exec php composer format
	docker compose exec node npm run format
