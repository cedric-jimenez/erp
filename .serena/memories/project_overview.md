# Aperçu du Projet ERP

## Objectif
Système ERP (Enterprise Resource Planning) conçu pour les PME, axé sur :
- **Articles** (création, suivi, archivage)
- **Stock** (mouvements, alertes de stock faible)  
- **Bons** (entrée, sortie, transfert, bons de livraison)

## Stack Technologique
- **Backend**: NestJS + TypeScript + Swagger
- **ORM**: Prisma (avec PostgreSQL prod, SQLite dev)
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Tests**: Jest (unit + e2e, coverage 70-90%)
- **Qualité**: ESLint + Prettier
- **Conteneurisation**: Docker + Docker Compose

## État Actuel
✅ **Backend complet**: Architecture NestJS, Swagger, tests, qualité
⏳ **Base de données**: Infrastructure Prisma prête (non implémentée)
⏳ **Frontend**: Planifié (Next.js)

## Architecture Modulaire
```
backend/src/
├── main.ts              # Point d'entrée avec Swagger
├── app.module.ts        # Module principal
├── prisma/             # Service Prisma
└── modules/
    └── items/          # Module Articles (implémenté)
        ├── dto/        # Data Transfer Objects
        ├── entities/   # Entités TypeScript
        └── test/       # Tests + helpers
```

Le projet suit une architecture modulaire NestJS propre avec séparation claire des responsabilités.