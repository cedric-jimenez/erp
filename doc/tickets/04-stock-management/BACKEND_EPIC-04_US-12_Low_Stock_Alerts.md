# EPIC-04_US-12 : Alertes de stock bas

**Epic**: EPIC-04 Gestion Stocks  
**Story Points**: 3  
**Sprint**: 6  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux être alerté quand un article passe sous son seuil minimum pour anticiper les commandes.

## Critères d'Acceptation

**GIVEN** un article avec un `stock_min` défini à 10  
**WHEN** son stock actuel passe à 8  
**THEN** l'article apparaît dans les alertes de stock bas  
**AND** une notification est générée  

**GIVEN** je consulte le tableau de bord  
**WHEN** j'accède aux alertes  
**THEN** je vois tous les articles sous leur seuil minimum  
**AND** ils sont triés par criticité (stock le plus bas en premier)  

**GIVEN** je règle un problème de stock bas  
**WHEN** le stock remonte au-dessus du seuil  
**THEN** l'alerte disparaît automatiquement  

## Tâches Techniques (Definition of Done)

- [ ] Extension du service Stock :
  - `getLowStockItems()` - Articles sous seuil minimum
  - `checkLowStockAlerts()` - Vérification périodique
  - `getStockStatus(itemId)` - Statut d'un article (OK/LOW/CRITICAL)
  - `generateLowStockReport()` - Rapport des alertes
- [ ] Système d'alertes :
  - Table `stock_alerts` pour historique
  - Types d'alertes (LOW_STOCK, OUT_OF_STOCK)
  - Statuts (ACTIVE, RESOLVED, IGNORED)
- [ ] Extension du contrôleur Stock :
  - `GET /api/v1/stock/alerts` (alertes actives)
  - `GET /api/v1/stock/alerts/history` (historique)
  - `POST /api/v1/stock/alerts/:id/resolve` (marquer résolu)
  - `POST /api/v1/stock/alerts/:id/ignore` (ignorer temporairement)
- [ ] Calculs de criticité :
  - Ratio stock_actuel / stock_min
  - Niveaux : NORMAL (>100%), LOW (<100%), CRITICAL (<50%), OUT (=0)
  - Prédiction de rupture basée sur consommation moyenne
- [ ] Tâche périodique (optionnel) :
  - Job CRON pour vérification automatique
  - Génération d'alertes email/notification
- [ ] Tests unitaires Jest :
  - Tests de détection des stocks bas
  - Tests de calculs de criticité
  - Tests de résolution d'alertes
  - Tests de génération de rapports
  - Fixtures items avec différents niveaux de stock

## Tests d'Acceptation

- [ ] Détection automatique des stocks bas
- [ ] Calcul correct des niveaux de criticité
- [ ] Tri par urgence (stock le plus bas en premier)
- [ ] Résolution automatique quand stock remonte
- [ ] Historique des alertes conservé
- [ ] Possibilité d'ignorer temporairement
- [ ] Rapport de stock bas exportable
- [ ] Tests unitaires passants (coverage > 80%)

## Fichiers à Créer/Modifier

- `backend/src/modules/stock/entities/stock-alert.entity.ts`
- `backend/src/modules/stock/dto/stock-alert.dto.ts`
- `backend/src/modules/stock/stock.service.ts` (méthodes alertes)
- `backend/src/modules/stock/stock.controller.ts` (endpoints alertes)
- `backend/src/modules/stock/enums/stock-status.enum.ts`
- `backend/src/modules/stock/enums/alert-type.enum.ts`
- `backend/prisma/schema.prisma` (table stock_alerts)
- `backend/src/modules/stock/stock.service.spec.ts` (tests alertes)
- `backend/src/tasks/stock-alerts.task.ts` (job périodique, optionnel)