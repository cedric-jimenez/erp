# ERP Project - Docker Management

.PHONY: help up down urls

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-10s %s\n", $$1, $$2}'

up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

urls: ## Show project URLs
	@echo "🌐 URLs du projet ERP:"
	@echo "   Frontend:     http://localhost:3000"
	@echo "   Backend:      http://localhost:3001"
	@echo "   API Swagger:  http://localhost:3001/api"
	@echo "   pgAdmin:      http://localhost:5050"