# BACKEND-004 : Module Items (Gestion des Articles)

**Type**: Feature
**Priorité**: High
**Estimation**: 5-6h

## Description

Implémenter le module complet de gestion des items avec CRUD, validation, et intégration avec le système de stock.

## Tâches

- [ ] Création du module Items (`src/modules/items/`)
- [ ] Entity Item (`item.entity.ts`)
- [ ] DTOs pour les opérations CRUD (`create-item.dto.ts`, `update-item.dto.ts`)
- [ ] Service Items (`item.service.ts`) :
  - Méthodes CRUD complètes
  - Recherche et filtrage
  - Validation des codes uniques
  - Archivage soft delete
- [ ] Contrôleur Items (`item.controller.ts`) :
  - `GET /api/v1/items` (liste avec pagination/filtres)
  - `GET /api/v1/items/:id` (détail)
  - `POST /api/v1/items` (création)
  - `PUT /api/v1/items/:id` (modification)
  - `DELETE /api/v1/items/:id` (archivage)
- [ ] Validation des données avec class-validator
- [ ] Tests unitaires pour le service
- [ ] Documentation Swagger

## Critères d'acceptation

- [ ] Toutes les routes CRUD fonctionnelles
- [ ] Validation des champs obligatoires
- [ ] Codes d'items uniques
- [ ] Pagination et filtres sur la liste
- [ ] Archivage au lieu de suppression physique
- [ ] Documentation API complète
- [ ] Tests unitaires passants

## Fichiers à créer

- `backend/src/modules/items/items.module.ts`
- `backend/src/modules/items/entities/item.entity.ts`
- `backend/src/modules/items/dto/create-item.dto.ts`
- `backend/src/modules/items/dto/update-item.dto.ts`
- `backend/src/modules/items/items.service.ts`
- `backend/src/modules/items/items.controller.ts`
- `backend/src/modules/items/items.service.spec.ts`