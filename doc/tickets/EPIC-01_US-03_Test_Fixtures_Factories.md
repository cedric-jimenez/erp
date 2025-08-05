# US-03 : Fixtures et Factories de test

**Epic**: EPIC-01 Infrastructure  
**Story Points**: 5  
**Sprint**: 2  
**Assigné**: Backend Dev  

## User Story

En tant que **développeur**, je veux un système de fixtures et factories pour tester efficacement mes modules.

## Critères d'Acceptation

**GIVEN** les modules métier développés  
**WHEN** j'écris des tests unitaires  
**THEN** je peux utiliser des fixtures préparées  
**AND** je peux générer des données de test avec les factories  
**AND** les tests s'exécutent rapidement (< 5s)  

## Tâches Techniques (Definition of Done)

- [ ] Installation Faker.js pour génération de données
- [ ] Création du système de fixtures :
  - Base `TestFixture` class avec helpers communs
  - Fixtures utilisateurs (Admin, Operators, différents rôles)
  - Fixtures items (catégories variées, stocks différents)
  - Fixtures vouchers (tous types et statuts)
  - Fixtures mouvements de stock
- [ ] Factories avec Faker.js :
  - `UserFactory` pour génération d'utilisateurs
  - `ItemFactory` pour génération d'items
  - `VoucherFactory` pour vouchers complexes
  - `StockMovementFactory` pour mouvements
- [ ] Configuration des tests :
  - Database de test séparée (SQLite en mémoire)
  - Setup/Teardown automatique pour tests
  - Helpers pour cleanup entre tests
- [ ] Documentation des fixtures

## Tests d'Acceptation

- [ ] Factory génère des données cohérentes
- [ ] Database de test isolée des autres
- [ ] Setup/Teardown automatique fonctionne
- [ ] Performance tests < 5s
- [ ] Documentation complète

## Fichiers à Créer

- `backend/src/test/fixtures/base-fixture.ts`
- `backend/src/test/fixtures/user.fixture.ts`
- `backend/src/test/fixtures/item.fixture.ts`
- `backend/src/test/fixtures/voucher.fixture.ts`
- `backend/src/test/fixtures/stock-movement.fixture.ts`
- `backend/src/test/factories/user.factory.ts`
- `backend/src/test/factories/item.factory.ts`
- `backend/src/test/factories/voucher.factory.ts`
- `backend/src/test/helpers/test-database.helper.ts`
- `backend/src/test/setup.ts`
- `backend/docs/TESTING.md`