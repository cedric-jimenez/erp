# EPIC-01 : Infrastructure et Configuration

**Epic Owner**: Tech Lead
**Sprint**: 1-2
**Story Points Estimés**: 16 points
**Status**: 📋 TODO

## Description de l'Epic

En tant qu'**équipe de développement**, nous devons mettre en place l'infrastructure technique de base du backend (NestJS, Docker, base de données) pour pouvoir commencer le développement des fonctionnalités métier.

## Valeur Métier

- Base technique solide et fonctionnelle
- Environnement reproductible avec Docker
- Connexion base de données opérationnelle
- API "Hello World" comme preuve de concept

## User Stories

### US-01 : Configuration NestJS + Docker
**Story Points**: 8 | **Status**: 📋 TODO  
**Fichier**: `BACKEND_EPIC-01_US-01_NestJS_Docker_Setup.md`

### US-02 : Connexion Database + Prisma
**Story Points**: 5 | **Status**: 📋 TODO  
**Fichier**: `BACKEND_EPIC-01_US-02_Database_Prisma_Setup.md`

### US-03 : Tests de base
**Story Points**: 3 | **Status**: 📋 TODO  
**Fichier**: `BACKEND_EPIC-01_US-03_Test_Fixtures_Factories.md`

## Critères d'Acceptation de l'Epic

- [ ] Environnement Docker fonctionnel (`docker-compose up`)
- [ ] API "Hello World" accessible sur http://localhost:3001
- [ ] Connexion PostgreSQL + Prisma fonctionnelle
- [ ] Tests de base configurés et opérationnels

## Dépendances

Aucune - Epic fondamentale

## Risques

- Complexité Docker sur différents OS
- Performance de la base de données locale