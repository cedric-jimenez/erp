# BACKEND-006 : Module Stock (Gestion des Mouvements)

**Type**: Feature
**Priorité**: High
**Estimation**: 4-5h

## Description

Implémenter le module de gestion des mouvements de stock avec calcul automatique des inventaires et alertes de stock bas.

## Tâches

- [ ] Création du module Stock (`src/modules/stock/`)
- [ ] Entity StockMovement (`stock-movement.entity.ts`)
- [ ] DTOs pour les mouvements (`create-stock-movement.dto.ts`)
- [ ] Service Stock (`stock.service.ts`) :
  - Création des mouvements de stock
  - Calcul des inventaires actuels par item
  - Historique des mouvements
  - Détection des stocks bas (< stock_min)
  - Rapports de stock par période
- [ ] Contrôleur Stock (`stock.controller.ts`) :
  - `GET /api/v1/stock/movements` (historique)
  - `GET /api/v1/stock/inventory` (inventaire actuel)
  - `GET /api/v1/stock/low-stock` (alertes stock bas)
  - `GET /api/v1/stock/movements/:itemId` (mouvements par item)
- [ ] Logique métier :
  - Types de mouvements (IN/OUT/TRANSFER)
  - Validation des quantités négatives
  - Calculs d'inventaire en temps réel
- [ ] Tests unitaires

## Critères d'acceptation

- [ ] Mouvements de stock enregistrés automatiquement
- [ ] Inventaires calculés correctement
- [ ] Alertes de stock bas fonctionnelles
- [ ] Historique complet des mouvements
- [ ] Rapports de stock par période
- [ ] Validation des quantités
- [ ] Tests unitaires passants

## Fichiers à créer

- `backend/src/modules/stock/stock.module.ts`
- `backend/src/modules/stock/entities/stock-movement.entity.ts`
- `backend/src/modules/stock/dto/create-stock-movement.dto.ts`
- `backend/src/modules/stock/stock.service.ts`
- `backend/src/modules/stock/stock.controller.ts`
- `backend/src/modules/stock/stock.service.spec.ts`