# EPIC-03_US-08 : Gestion des catégories

**Epic**: EPIC-03 Gestion Articles  
**Story Points**: 3  
**Sprint**: 5  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux classer mes articles par catégories pour mieux les organiser.

## Critères d'Acceptation

**GIVEN** je veux organiser mes articles  
**WHEN** je crée une nouvelle catégorie "Mobilier"  
**THEN** la catégorie est disponible lors de la création d'articles  
**AND** elle apparaît dans la liste des catégories  

**GIVEN** j'ai des catégories existantes  
**WHEN** je consulte la liste  
**THEN** je vois toutes les catégories avec le nombre d'articles associés  

**GIVEN** je veux supprimer une catégorie  
**WHEN** la catégorie contient des articles  
**THEN** la suppression est refusée avec un message explicite  

## Tâches Techniques (Definition of Done)

- [ ] Création d'une entity Category séparée ou enum dans Item
- [ ] Extension du schéma Prisma pour les catégories
- [ ] Service Categories (`categories.service.ts`) :
  - `findAll()` - Liste avec comptage d'articles
  - `create()` - Création de catégorie
  - `update()` - Modification
  - `remove()` - Suppression avec vérification
- [ ] Contrôleur Categories (`categories.controller.ts`) :
  - `GET /api/v1/categories` (liste avec stats)
  - `POST /api/v1/categories` (création)
  - `PUT /api/v1/categories/:id` (modification)
  - `DELETE /api/v1/categories/:id` (suppression)
- [ ] DTOs pour catégories :
  - `create-category.dto.ts`
  - `update-category.dto.ts`
- [ ] Validation :
  - Noms de catégories uniques
  - Empêcher suppression si articles associés
- [ ] Intégration avec le module Items :
  - Validation existence catégorie lors création item
  - Cascade de mise à jour si nécessaire
- [ ] Tests unitaires :
  - CRUD catégories
  - Validation contraintes
  - Comptage d'articles par catégorie

## Tests d'Acceptation

- [ ] CRUD catégories fonctionnel
- [ ] Noms uniques validés
- [ ] Suppression bloquée si articles associés
- [ ] Comptage d'articles par catégorie correct
- [ ] Intégration avec création d'articles
- [ ] Validation existence catégorie
- [ ] Tests unitaires passants

## Fichiers à Créer

- `backend/src/modules/categories/categories.module.ts`
- `backend/src/modules/categories/entities/category.entity.ts`
- `backend/src/modules/categories/dto/create-category.dto.ts`
- `backend/src/modules/categories/dto/update-category.dto.ts`
- `backend/src/modules/categories/categories.service.ts`
- `backend/src/modules/categories/categories.controller.ts`
- `backend/src/modules/categories/categories.service.spec.ts`
- `backend/prisma/migrations/add-categories-table.sql`