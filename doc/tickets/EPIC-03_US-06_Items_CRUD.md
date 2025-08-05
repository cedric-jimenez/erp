# EPIC-03_US-06 : CRUD Articles

**Epic**: EPIC-03 Gestion Articles  
**Story Points**: 8  
**Sprint**: 4  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux créer, consulter, modifier et archiver des articles pour maintenir ma base de données produits.

## Critères d'Acceptation

**GIVEN** je suis authentifié comme gestionnaire  
**WHEN** je crée un nouvel article avec code, nom et catégorie  
**THEN** l'article est sauvegardé avec un code unique  
**AND** il apparaît dans la liste des articles actifs  

**GIVEN** j'ai des articles existants  
**WHEN** je consulte la liste des articles  
**THEN** je vois tous les articles actifs paginés  
**AND** je peux filtrer par nom, code ou catégorie  

**GIVEN** je veux supprimer un article  
**WHEN** je demande sa suppression  
**THEN** l'article est archivé (soft delete)  
**AND** il n'apparaît plus dans la liste active  
**AND** l'historique est conservé  

## Tâches Techniques (Definition of Done)

- [ ] Création du module Items (`src/modules/items/`)
- [ ] Entity Item (`item.entity.ts`) avec soft delete
- [ ] DTOs pour les opérations CRUD :
  - `create-item.dto.ts` avec validation
  - `update-item.dto.ts` avec validation partielle
  - `query-items.dto.ts` pour filtres et pagination
- [ ] Service Items (`items.service.ts`) :
  - `create()` - Création avec validation code unique
  - `findAll()` - Liste avec pagination et filtres
  - `findOne()` - Détail d'un article
  - `update()` - Modification
  - `remove()` - Archivage (soft delete)
  - `restore()` - Restauration d'un article archivé
- [ ] Contrôleur Items (`items.controller.ts`) :
  - `GET /api/v1/items` (liste paginée avec filtres)
  - `GET /api/v1/items/:id` (détail)
  - `POST /api/v1/items` (création)
  - `PUT /api/v1/items/:id` (modification complète)
  - `PATCH /api/v1/items/:id` (modification partielle)
  - `DELETE /api/v1/items/:id` (archivage)
- [ ] Validation des données avec class-validator
- [ ] Tests unitaires Jest :
  - Tests du service Items (CRUD complet)
  - Tests du contrôleur (endpoints)
  - Tests de validation des DTOs
  - Mocks du service Prisma
  - Tests d'archivage (soft delete)
  - Fixtures items pour tests (actifs, archivés, catégories)
  - Factory pattern pour génération d'items de test
- [ ] Documentation Swagger complète

## Tests d'Acceptation

- [ ] Toutes les routes CRUD fonctionnelles
- [ ] Validation des champs obligatoires (nom, code)
- [ ] Codes d'articles uniques validés
- [ ] Pagination efficace (20 items par page)
- [ ] Filtres par nom, code, catégorie fonctionnels
- [ ] Archivage au lieu de suppression physique
- [ ] Documentation API Swagger complète
- [ ] Tests unitaires passants (coverage > 80%)
- [ ] Tests d'intégration pour endpoints CRUD

## Fichiers à Créer

- `backend/src/modules/items/items.module.ts`
- `backend/src/modules/items/entities/item.entity.ts`
- `backend/src/modules/items/dto/create-item.dto.ts`
- `backend/src/modules/items/dto/update-item.dto.ts`
- `backend/src/modules/items/dto/query-items.dto.ts`
- `backend/src/modules/items/items.service.ts`
- `backend/src/modules/items/items.controller.ts`
- `backend/src/modules/items/items.service.spec.ts`
- `backend/src/modules/items/items.controller.spec.ts`
- `backend/src/modules/items/dto/create-item.dto.spec.ts`