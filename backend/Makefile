# ERP Backend Makefile
# Usage: make <target>

.PHONY: help install build start dev debug prod clean lint test test-watch test-cov test-e2e docker-build docker-run docker-stop format

# Default target
help: ## Show this help message
	@echo "ERP Backend - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

# Development commands
install: ## Install dependencies
	yarn install

build: ## Build the application
	yarn build

start: ## Start production server
	yarn start

dev: ## Start development server with hot reload
	yarn start:dev

debug: ## Start development server in debug mode
	yarn start:debug

prod: ## Start production server
	yarn start:prod

# Code quality
lint: ## Run ESLint and fix issues
	yarn lint

format: ## Format code with Prettier
	yarn prettier --write "src/**/*.ts"

# Testing
test: ## Run unit tests
	yarn test

test-watch: ## Run tests in watch mode
	yarn test:watch

test-cov: ## Run tests with coverage
	yarn test:cov

test-e2e: ## Run end-to-end tests
	yarn test:e2e

# Utilities
clean: ## Clean build artifacts and node_modules
	rm -rf dist/
	rm -rf node_modules/
	rm -f yarn.lock

clean-build: ## Clean only build artifacts
	rm -rf dist/

# Docker commands (local backend)
docker-build: ## Build Docker image
	docker build -t erp-backend .

docker-run: ## Run container locally
	docker run -p 3001:3001 erp-backend

docker-up: ## Start backend services (PostgreSQL + Backend dev)
	docker compose up --build -d

docker-up-prod: ## Start backend in production mode
	docker compose --profile production up --build -d

docker-down: ## Stop backend services
	docker compose down

docker-logs: ## View backend logs
	docker compose logs -f backend-dev

docker-db: ## Start only PostgreSQL
	docker compose up -d postgres

# Full stack commands (from project root)
docker-compose-up: ## Start full stack with docker compose (from project root)
	cd .. && docker compose --env-file .env.docker up --build -d

docker-compose-down: ## Stop full stack docker compose (from project root)
	cd .. && docker compose down

# Project setup
setup: install build ## Initial project setup
	@echo "✅ Backend setup completed!"
	@echo "📋 Run 'make dev' to start development server"
	@echo "🐋 Run 'make docker-compose-up' to start with Docker"

# Health check
check: lint test build ## Run all checks (lint, test, build)
	@echo "✅ All checks passed!"