# BACKEND-005 : Module Vouchers (Gestion des Bons)

**Type**: Feature
**Priorité**: High
**Estimation**: 6-8h
**Dépendances**: BACKEND-004 (Items), BACKEND-006 (Stock), BACKEND-010 (Users)

## Description

Implémenter le module de gestion des vouchers (bons d'entrée, sortie, transfert, livraison) avec gestion des lignes et génération automatique des mouvements de stock.

## Tâches

- [ ] Création du module Vouchers (`src/modules/vouchers/`)
- [ ] Entities :
  - `voucher.entity.ts`
  - `voucher-line.entity.ts`
- [ ] DTOs :
  - `create-voucher.dto.ts`
  - `create-voucher-line.dto.ts`
  - `update-voucher.dto.ts`
- [ ] Service Vouchers (`voucher.service.ts`) :
  - CRUD des vouchers
  - Gestion des lignes de voucher
  - Validation du statut (draft/validated)
  - Génération automatique des mouvements de stock
  - Calculs de quantités
- [ ] Contrôleur Vouchers (`voucher.controller.ts`) :
  - Routes CRUD complètes
  - Endpoint de validation/invalidation
  - Filtres par type et statut
- [ ] Logique métier :
  - Numérotation automatique des vouchers
  - Validation des quantités disponibles
  - Transition des statuts
- [ ] Tests unitaires

## Critères d'acceptation

- [ ] CRUD vouchers fonctionnel
- [ ] Gestion des lignes multiples par voucher
- [ ] Validation génère les mouvements de stock
- [ ] Contrôles de quantités disponibles
- [ ] Filtres par type/statut/date
- [ ] Numérotation automatique
- [ ] Tests unitaires complets

## Fichiers à créer

- `backend/src/modules/vouchers/vouchers.module.ts`
- `backend/src/modules/vouchers/entities/`
- `backend/src/modules/vouchers/dto/`
- `backend/src/modules/vouchers/vouchers.service.ts`
- `backend/src/modules/vouchers/vouchers.controller.ts`
- `backend/src/modules/vouchers/vouchers.service.spec.ts`