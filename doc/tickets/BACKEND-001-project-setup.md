# BACKEND-001 : Configuration initiale du projet NestJS

**Type**: Setup
**Priorité**: High
**Estimation**: 2-3h

## Description

Initialiser la structure de base du projet backend avec NestJS, configuration TypeScript, et outils de développement.

## Tâches

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
- [ ] Configuration des variables d'environnement (`.env.example`)

## Critères d'acceptation

- [ ] Le serveur NestJS démarre sur le port 3001
- [ ] TypeScript compile sans erreur
- [ ] ESLint/Prettier configurés et fonctionnels
- [ ] Documentation Swagger accessible sur `/api`
- [ ] Dockerfile construit une image fonctionnelle

## Fichiers à créer

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/Dockerfile`
- `backend/.env.example`