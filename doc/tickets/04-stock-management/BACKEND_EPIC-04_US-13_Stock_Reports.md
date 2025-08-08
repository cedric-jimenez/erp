# EPIC-04_US-13 : Rapports de stock

**Epic**: EPIC-04 Gestion Stocks  
**Story Points**: 2  
**Sprint**: 6  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux générer des rapports de mouvements par période pour analyser l'activité.

## Critères d'Acceptation

**GIVEN** je veux analyser l'activité du mois dernier  
**WHEN** je génère un rapport mensuel  
**THEN** je vois le résumé des entrées, sorties et transferts  
**AND** je peux identifier les articles les plus actifs  

**GIVEN** je veux comparer deux périodes  
**WHEN** je génère un rapport comparatif  
**THEN** je vois l'évolution des mouvements entre les périodes  

**GIVEN** je veux un rapport pour un article spécifique  
**WHEN** je sélectionne l'article et la période  
**THEN** je vois le détail de tous ses mouvements  

## Critères d'Acceptation

**GIVEN** je demande un rapport du mois dernier  
**WHEN** le rapport est généré  
**THEN** je vois les statistiques par type de mouvement  
**AND** je peux l'exporter en CSV ou PDF  

**GIVEN** je veux analyser un article spécifique  
**WHEN** je génère son rapport de mouvements  
**THEN** je vois sa courbe d'évolution de stock  

## Tâches Techniques (Definition of Done)

- [ ] Extension du service Stock :
  - `generateMovementReport(dateRange, filters)` - Rapport général
  - `generateItemReport(itemId, dateRange)` - Rapport par article
  - `getMovementSummary(dateRange)` - Résumé statistique
  - `getTopActiveItems(dateRange, limit)` - Articles les plus actifs
  - `comparePeriodsReport(period1, period2)` - Comparaison périodes
- [ ] DTOs pour les rapports :
  - `stock-report-query.dto.ts` (paramètres de génération)
  - `movement-summary-response.dto.ts` (résumé statistique)
  - `item-activity-response.dto.ts` (activité par article)
- [ ] Extension du contrôleur Stock :
  - `GET /api/v1/stock/reports/movements` (rapport général)
  - `GET /api/v1/stock/reports/item/:itemId` (rapport par article)
  - `GET /api/v1/stock/reports/summary` (résumé statistique)
  - `GET /api/v1/stock/reports/top-active` (articles les plus actifs)
  - `POST /api/v1/stock/reports/export` (export CSV/PDF)
- [ ] Calculs statistiques :
  - Total entrées/sorties/transferts par période
  - Articles les plus/moins actifs
  - Évolution du stock global
  - Moyennes mobiles et tendances
- [ ] Export de données (optionnel) :
  - Génération CSV avec headers appropriés
  - Formatage des dates et nombres
  - Compression pour gros rapports
- [ ] Tests unitaires Jest :
  - Tests de génération de rapports
  - Tests de calculs statistiques
  - Tests de filtrage par période
  - Tests d'export (si implémenté)
  - Fixtures pour datasets de test

## Tests d'Acceptation

- [ ] Rapports générés avec données précises
- [ ] Filtrage par période fonctionnel
- [ ] Statistiques par type de mouvement correctes
- [ ] Identification des articles les plus actifs
- [ ] Comparaison entre périodes
- [ ] Export CSV fonctionnel (si implémenté)
- [ ] Performance acceptable sur gros volumes
- [ ] Tests unitaires passants (coverage > 80%)

## Fichiers à Créer/Modifier

- `backend/src/modules/stock/dto/stock-report-query.dto.ts`
- `backend/src/modules/stock/dto/movement-summary-response.dto.ts`
- `backend/src/modules/stock/dto/item-activity-response.dto.ts`
- `backend/src/modules/stock/stock.service.ts` (méthodes rapports)
- `backend/src/modules/stock/stock.controller.ts` (endpoints rapports)
- `backend/src/modules/stock/services/report-generator.service.ts`
- `backend/src/modules/stock/utils/export.util.ts` (si export)
- `backend/src/modules/stock/stock.service.spec.ts` (tests rapports)