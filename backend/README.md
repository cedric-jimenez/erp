# ERP Backend API

Backend NestJS pour le système ERP de gestion des articles, stocks et bons.

## Description

API REST développée avec NestJS pour gérer :
- **Items** : Création, édition, archivage des articles
- **Stock** : Mouvements de stock, alertes stock bas
- **Vouchers** : Bons d'entrée, sortie, transfert, livraison
- **Authentication** : Gestion des utilisateurs et permissions

## Technologies

- **Framework** : NestJS + TypeScript
- **Base de données** : PostgreSQL (production), SQLite (développement)
- **ORM** : Prisma (planifié)
- **Documentation** : Swagger/OpenAPI
- **Authentification** : JWT + RBAC (planifié)

## Installation

```bash
yarn install
```

## Démarrage

```bash
# Mode développement
yarn start:dev

# Mode production
yarn start:prod

# Mode debug
yarn start:debug
```

## URLs

- **API** : http://localhost:3001
- **Documentation Swagger** : http://localhost:3001/api

## Scripts disponibles

```bash
# Développement
yarn start:dev          # Démarre en mode watch

# Build
yarn build              # Compile le projet
yarn start:prod         # Démarre en mode production

# Tests
yarn test               # Tests unitaires
yarn test:e2e           # Tests end-to-end
yarn test:cov           # Couverture de code

# Code quality
yarn lint               # ESLint
yarn format             # Prettier
```

## Structure des modules (planifiée)

```
src/
├── app.module.ts
├── main.ts
├── common/             # Utilitaires partagés
├── modules/
│   ├── auth/          # Authentification
│   ├── items/         # Gestion des articles
│   ├── stock/         # Gestion des stocks
│   └── vouchers/      # Gestion des bons
└── database/          # Configuration Prisma
```

## API Endpoints (planifiés)

### Items
- `GET /api/v1/items` - Liste des articles
- `POST /api/v1/items` - Créer un article
- `GET /api/v1/items/:id` - Détail d'un article
- `PUT /api/v1/items/:id` - Modifier un article
- `DELETE /api/v1/items/:id` - Archiver un article

### Stock
- `GET /api/v1/stock/movements` - Mouvements de stock
- `GET /api/v1/stock/inventory` - Inventaire en temps réel
- `GET /api/v1/stock/alerts` - Alertes stock bas

### Vouchers
- `GET /api/v1/vouchers` - Liste des bons
- `POST /api/v1/vouchers` - Créer un bon
- `PUT /api/v1/vouchers/:id/validate` - Valider un bon

## Configuration

Variables d'environnement (`.env`) :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/erp"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Application
PORT=3001
NODE_ENV=development
```

## Docker

```bash
# Démarrage avec Docker Compose
docker-compose up -d

# Ou depuis la racine du projet
make up
make urls  # Affiche toutes les URLs
```

## Développement

Ce projet suit les conventions définies dans `CLAUDE.md` :
- **Code style** : ESLint + Prettier
- **Commits** : Conventional commits (`feat:`, `fix:`, `docs:`)
- **API** : RESTful avec versioning `/api/v1/`
- **Sécurité** : Validation avec class-validator, RBAC

## Documentation API

La documentation Swagger est automatiquement générée et accessible à l'adresse :
http://localhost:3001/api

Elle inclut :
- Description de tous les endpoints
- Schémas des données
- Exemples de requêtes/réponses
- Authentification Bearer Token

## Support

Consultez la documentation du projet dans le dossier `doc/` pour :
- Guidelines UX/UI
- Spécifications techniques
- Structure de données
- User stories et épics