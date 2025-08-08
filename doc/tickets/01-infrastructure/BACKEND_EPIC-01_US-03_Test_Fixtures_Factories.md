# US-03 : Tests de base

**Epic**: EPIC-01 Infrastructure  
**Story Points**: 3  
**Sprint**: 2  
**Assigné**: Backend Dev  
**Status**: 📋 TODO

## User Story

En tant que **développeur**, je veux une configuration de tests de base pour pouvoir tester l'infrastructure.

## Critères d'Acceptation

**GIVEN** l'infrastructure mise en place  
**WHEN** je lance les tests  
**THEN** Jest exécute les tests sans erreur  
**AND** les tests d'intégration de base fonctionnent  
**AND** les tests s'exécutent rapidement (< 5s)  

## Tâches Techniques (Definition of Done)

- [ ] Configuration Jest pour NestJS
- [ ] Configuration des tests d'intégration :
  - Database de test séparée (SQLite en mémoire ou PostgreSQL test)
  - Setup/Teardown automatique pour tests
  - Helpers de base pour cleanup entre tests
- [ ] Tests basiques :
  - Test de l'application (app.e2e-spec.ts)
  - Test de connexion Prisma
  - Test du health check endpoint
- [ ] Scripts npm pour les tests

## Tests d'Acceptation

- [ ] `npm run test` exécute les tests unitaires
- [ ] `npm run test:e2e` exécute les tests d'intégration
- [ ] Database de test isolée des autres
- [ ] Setup/Teardown automatique fonctionne
- [ ] Performance tests < 5s

## Fichiers à Créer

- `backend/test/app.e2e-spec.ts`
- `backend/test/jest-e2e.json`
- `backend/src/test/test-database.helper.ts`
- `backend/src/test/setup.ts`