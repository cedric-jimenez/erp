# EPIC-05_US-14 : Création de bons multi-lignes

**Epic**: EPIC-05 Gestion Bons  
**Story Points**: 10  
**Sprint**: 6  
**Assigné**: Backend Dev  

## User Story

En tant qu'**opérateur**, je veux créer des bons avec plusieurs lignes d'articles pour traiter des opérations complexes en une fois.

## Critères d'Acceptation

**GIVEN** je veux créer un bon d'entrée avec plusieurs articles  
**WHEN** j'ajoute des lignes avec différents articles et quantités  
**THEN** le bon est créé avec toutes les lignes associées  
**AND** chaque ligne est validée (article existe, quantité > 0)  

**GIVEN** je crée un bon avec des lignes  
**WHEN** le bon est sauvegardé en brouillon  
**THEN** je peux le modifier et ajouter/supprimer des lignes  
**AND** les modifications sont persistées  

**GIVEN** je consulte un bon existant  
**WHEN** j'accède à ses détails  
**THEN** je vois toutes ses lignes avec les articles et quantités  
**AND** je vois le statut du bon (draft/validated)  

## Tâches Techniques (Definition of Done)

- [ ] Création du module Vouchers (`src/modules/vouchers/`)
- [ ] Entities :
  - `voucher.entity.ts` (bon principal)
  - `voucher-line.entity.ts` (lignes de bon)
  - Relations 1→n entre Voucher et VoucherLine
- [ ] DTOs pour les vouchers :
  - `create-voucher.dto.ts` avec validation
  - `create-voucher-line.dto.ts` avec validation
  - `update-voucher.dto.ts` pour modifications
  - `voucher-response.dto.ts` avec lignes incluses
- [ ] Service Vouchers (`vouchers.service.ts`) :
  - `create(createVoucherDto)` - Création avec lignes
  - `createDraft(createVoucherDto)` - Création brouillon
  - `updateDraft(id, updateVoucherDto)` - Modification brouillon
  - `preValidate(id)` - Pré-validation avant soumission
  - `findAll(filters)` - Liste avec pagination
  - `findOne(id)` - Détail avec lignes
  - `update(id, updateVoucherDto)` - Modification
  - `addLine(voucherId, lineDto)` - Ajout ligne
  - `removeLine(voucherId, lineId)` - Suppression ligne
  - `updateLine(lineId, lineDto)` - Modification ligne
- [ ] Contrôleur Vouchers (`vouchers.controller.ts`) :
  - `POST /api/v1/vouchers` (création)
  - `POST /api/v1/vouchers/draft` (création brouillon)
  - `PUT /api/v1/vouchers/:id/draft` (modification brouillon)
  - `POST /api/v1/vouchers/:id/pre-validate` (pré-validation)
  - `GET /api/v1/vouchers` (liste avec filtres)
  - `GET /api/v1/vouchers/:id` (détail avec lignes)
  - `PUT /api/v1/vouchers/:id` (modification)
  - `POST /api/v1/vouchers/:id/lines` (ajout ligne)
  - `DELETE /api/v1/vouchers/:id/lines/:lineId` (suppression ligne)
- [ ] Validation métier :
  - Articles des lignes doivent exister
  - Quantités strictement positives
  - Au moins une ligne par voucher
  - Types de vouchers valides (ENTRY, EXIT, TRANSFER, DELIVERY)
- [ ] Tests unitaires Jest :
  - Tests du service Vouchers (CRUD + lignes)
  - Tests de validation des lignes
  - Tests de modification des lignes
  - Mocks des services Items
  - Fixtures vouchers (draft, validated, tous types)
  - Fixtures voucher_lines avec items associés
  - Factory pour création de vouchers complexes

## Tests d'Acceptation

- [ ] Création de vouchers multi-lignes fonctionnelle
- [ ] Validation des articles et quantités
- [ ] Modification des lignes en mode draft
- [ ] Suppression de lignes possible
- [ ] Validation empêche vouchers vides
- [ ] Détail complet avec toutes les lignes
- [ ] Filtrage par type et statut
- [ ] Tests unitaires passants (coverage > 85%)

## Fichiers à Créer

- `backend/src/modules/vouchers/vouchers.module.ts`
- `backend/src/modules/vouchers/entities/voucher.entity.ts`
- `backend/src/modules/vouchers/entities/voucher-line.entity.ts`
- `backend/src/modules/vouchers/dto/create-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/create-voucher-line.dto.ts`
- `backend/src/modules/vouchers/dto/update-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/voucher-response.dto.ts`
- `backend/src/modules/vouchers/enums/voucher-type.enum.ts`
- `backend/src/modules/vouchers/enums/voucher-status.enum.ts`
- `backend/src/modules/vouchers/vouchers.service.ts`
- `backend/src/modules/vouchers/vouchers.controller.ts`
- `backend/src/modules/vouchers/vouchers.service.spec.ts`
- `backend/src/modules/vouchers/vouchers.controller.spec.ts`
- `backend/src/modules/vouchers/dto/create-voucher.dto.spec.ts`