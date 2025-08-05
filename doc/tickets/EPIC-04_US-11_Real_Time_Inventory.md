# EPIC-04_US-11 : Calcul d'inventaire en temps réel

**Epic**: EPIC-04 Gestion Stocks  
**Story Points**: 8  
**Sprint**: 6  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux connaître le stock actuel de chaque article en temps réel pour prendre des décisions éclairées.

## Critères d'Acceptation

**GIVEN** j'ai des mouvements de stock pour un article  
**WHEN** je consulte son inventaire actuel  
**THEN** je vois la quantité calculée à partir de tous les mouvements  
**AND** le calcul est exact et rapide (< 200ms)  

**GIVEN** je veux voir l'inventaire global  
**WHEN** j'accède au tableau de bord stock  
**THEN** je vois tous les articles avec leur stock actuel  
**AND** les articles sont triés par niveau de stock  

**GIVEN** un nouveau mouvement est créé  
**WHEN** le mouvement est enregistré  
**THEN** l'inventaire de l'article est immédiatement mis à jour  

## Tâches Techniques (Definition of Done)

- [ ] Extension du service Stock :
  - `calculateInventory(itemId)` - Calcul pour un article
  - `calculateAllInventories()` - Calcul global optimisé
  - `getCurrentStock(itemId)` - Stock actuel avec cache
  - `getInventorySnapshot()` - Photo instantanée complète
- [ ] Système de cache Redis (optionnel) :
  - Cache des inventaires calculés
  - Invalidation lors de nouveaux mouvements
  - TTL configuré pour les calculs lourds
- [ ] Optimisations base de données :
  - Requêtes agrégées Prisma performantes
  - Index sur les champs de calcul
  - Vues matérialisées si nécessaire
- [ ] Extension du contrôleur Stock :
  - `GET /api/v1/stock/inventory` (inventaire global)
  - `GET /api/v1/stock/inventory/item/:itemId` (article spécifique)
  - `GET /api/v1/stock/inventory/low` (stocks bas uniquement)
  - `POST /api/v1/stock/inventory/refresh` (recalcul forcé)
- [ ] Tests de performance :
  - Tests avec 1000+ articles et 10000+ mouvements
  - Validation temps de réponse < 200ms
  - Tests de charge sur calculs simultanés
- [ ] Tests unitaires Jest :
  - Tests de calculs d'inventaire précis
  - Tests de performance sur gros datasets
  - Tests de cache (si implémenté)
  - Fixtures items avec stocks variés (bas, normal, élevé)
  - Datasets pour tests de performance d'inventaire

## Tests d'Acceptation

- [ ] Calculs d'inventaire précis à 100%
- [ ] Performance < 200ms pour inventaire complet
- [ ] Mise à jour temps réel lors nouveaux mouvements
- [ ] Gestion des stocks négatifs (alertes)
- [ ] Pagination efficace sur gros inventaires
- [ ] Cache fonctionnel (si implémenté)
- [ ] Recalcul forcé disponible
- [ ] Tests de performance validés

## Fichiers à Modifier/Créer

- `backend/src/modules/stock/stock.service.ts` (méthodes calcul)
- `backend/src/modules/stock/stock.controller.ts` (endpoints inventory)
- `backend/src/modules/stock/dto/inventory-response.dto.ts`
- `backend/src/modules/stock/dto/inventory-query.dto.ts`
- `backend/src/common/cache/cache.service.ts` (si Redis)
- `backend/prisma/schema.prisma` (index optimisation)
- `backend/src/modules/stock/stock.service.spec.ts` (tests calculs)
- `backend/src/modules/stock/performance.spec.ts` (tests performance)`