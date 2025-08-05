# EPIC-04_US-10 : Suivi des mouvements de stock

**Epic**: EPIC-04 Gestion Stocks  
**Story Points**: 8  
**Sprint**: 5  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux enregistrer automatiquement tous les mouvements de stock pour avoir une traçabilité complète.

## Critères d'Acceptation

**GIVEN** un voucher validé avec des lignes d'articles  
**WHEN** la validation est confirmée  
**THEN** des mouvements de stock sont automatiquement créés  
**AND** chaque ligne génère un mouvement avec le bon type (IN/OUT/TRANSFER)  
**AND** la quantité et la date sont correctement enregistrées  

**GIVEN** je veux consulter l'historique d'un article  
**WHEN** j'accède aux mouvements de cet article  
**THEN** je vois tous les mouvements chronologiques  
**AND** je peux identifier la source (voucher, ajustement manuel)  

## Tâches Techniques (Definition of Done)

- [ ] Création du module Stock (`src/modules/stock/`)
- [ ] Entity StockMovement (`stock-movement.entity.ts`) :
  - Relations avec Item et Voucher
  - Types de mouvements (IN, OUT, TRANSFER, ADJUSTMENT)
  - Quantité (positive/négative selon le type)
  - Date et utilisateur responsable
- [ ] DTOs pour les mouvements :
  - `create-stock-movement.dto.ts`
  - `query-stock-movements.dto.ts` (filtres et pagination)
- [ ] Service Stock (`stock.service.ts`) :
  - `createMovement()` - Création d'un mouvement
  - `createFromVoucher()` - Génération depuis un voucher
  - `findMovements()` - Historique avec filtres
  - `findByItem()` - Mouvements d'un article spécifique
  - `findByDateRange()` - Mouvements sur une période
- [ ] Contrôleur Stock (`stock.controller.ts`) :
  - `GET /api/v1/stock/movements` (historique général)
  - `GET /api/v1/stock/movements/item/:itemId` (par article)
  - `POST /api/v1/stock/movements` (création manuelle)
  - `GET /api/v1/stock/movements/summary` (résumé par période)
- [ ] Intégration avec le module Vouchers :
  - Hook de création automatique lors validation
  - Gestion des différents types de vouchers
- [ ] Tests unitaires Jest :
  - Tests du service Stock (création mouvements)
  - Tests de génération depuis vouchers
  - Tests de requêtes avec filtres
  - Mocks du service Prisma
  - Fixtures mouvements de stock (IN/OUT/TRANSFER)
  - Tests de validation des quantités

## Tests d'Acceptation

- [ ] Mouvements créés automatiquement depuis vouchers
- [ ] Types de mouvements correctement assignés
- [ ] Historique complet et chronologique
- [ ] Filtrage par article, date, type fonctionnel
- [ ] Pagination efficace sur gros volumes
- [ ] Validation des quantités (pas de zéro)
- [ ] Traçabilité utilisateur et source
- [ ] Tests unitaires passants (coverage > 80%)

## Fichiers à Créer

- `backend/src/modules/stock/stock.module.ts`
- `backend/src/modules/stock/entities/stock-movement.entity.ts`
- `backend/src/modules/stock/dto/create-stock-movement.dto.ts`
- `backend/src/modules/stock/dto/query-stock-movements.dto.ts`
- `backend/src/modules/stock/stock.service.ts`
- `backend/src/modules/stock/stock.controller.ts`
- `backend/src/modules/stock/stock.service.spec.ts`
- `backend/src/modules/stock/stock.controller.spec.ts`
- `backend/src/modules/stock/dto/create-stock-movement.dto.spec.ts`