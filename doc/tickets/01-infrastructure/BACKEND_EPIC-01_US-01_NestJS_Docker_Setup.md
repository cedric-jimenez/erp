# US-01 : Configuration NestJS + Docker

**Epic**: EPIC-01 Infrastructure  
**Story Points**: 8  
**Sprint**: 1  
**Assigné**: Tech Lead  
**Status**: 📋 TODO

## User Story

En tant que **développeur**, je veux un environnement NestJS avec Docker Compose pour développer localement rapidement.

## Critères d'Acceptation

**GIVEN** un projet vide  
**WHEN** je lance `docker-compose up`  
**THEN** le serveur NestJS démarre sur http://localhost:3001  
**AND** la documentation Swagger est accessible sur http://localhost:3001/api  
**AND** PostgreSQL est accessible et connecté  
**AND** pgAdmin est accessible sur http://localhost:5050  

## Tâches Techniques (Definition of Done)

- [ ] Créer le dossier `backend/`
- [ ] Initialiser le projet NestJS (`nest new backend`)
- [ ] Configuration TypeScript (`tsconfig.json`)
- [ ] Configuration ESLint + Prettier
- [ ] Installation des dépendances de base :
  - `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
  - `class-validator`, `class-transformer`
  - `@nestjs/swagger` pour la documentation API
- [ ] Configuration des scripts npm (`dev`, `build`, `test`, `lint`)
- [ ] Création du `Dockerfile` pour le backend
- [ ] Configuration Docker Compose :
  - Service backend (NestJS)
  - Service database (PostgreSQL)
  - Service pgAdmin
  - Volumes persistants
  - Networks Docker
- [ ] Configuration des variables d'environnement (`.env.example`, `.env.docker`)
- [ ] Scripts de démarrage Docker (`docker-start.sh`, `docker-stop.sh`)

## Tests d'Acceptation

- [ ] `npm run lint` sans erreur
- [ ] `npm run build` réussit
- [ ] `docker-compose up` démarre tous les services
- [ ] API Health check répond sur `/health`

## Fichiers à Créer

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/Dockerfile`
- `backend/.env.example`
- `docker-compose.yml` (racine du projet)
- `.env.docker`
- `scripts/docker-start.sh`
- `scripts/docker-stop.sh`