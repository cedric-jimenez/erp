# EPIC-05_US-17 : Contrôles de cohérence

**Epic**: EPIC-05 Gestion Bons  
**Story Points**: 2  
**Sprint**: 7  
**Assigné**: Backend Dev  

## User Story

En tant qu'**opérateur**, je veux que le système vérifie la disponibilité des stocks avant validation pour éviter les erreurs.

## Critères d'Acceptation

**GIVEN** je crée un bon de sortie pour 100 unités d'un article  
**WHEN** l'article n'a que 50 unités en stock  
**THEN** la validation est refusée avec un message explicite  
**AND** le bon reste en draft pour correction  

**GIVEN** je crée un bon avec un article archivé  
**WHEN** je tente de valider le bon  
**THEN** la validation est refusée  
**AND** le système suggère de remplacer l'article  

**GIVEN** plusieurs opérateurs travaillent simultanément  
**WHEN** deux bons tentent de consommer le même stock  
**THEN** seul le premier validé réussit  
**AND** le second reçoit une erreur de stock insuffisant  

## Tâches Techniques (Definition of Done)

- [ ] Service de validation étendu :
  - `validateStockAvailability(voucherId)` - Vérification disponibilité
  - `validateItemsActive(voucherId)` - Vérification articles actifs
  - `validateBusinessRules(voucherId)` - Règles métier globales
  - `preValidationCheck(voucherId)` - Contrôles avant validation
- [ ] Contrôles de cohérence :
  - Stock suffisant pour sorties/livraisons/transferts
  - Articles actifs (non archivés)
  - Quantités strictement positives
  - Entrepôts valides pour transferts
  - Permissions utilisateur selon type de bon
- [ ] Gestion de la concurrence :
  - Transactions avec verrous optimistes/pessimistes
  - Retry logic pour conflits temporaires
  - Messages d'erreur explicites pour conflits
- [ ] Messages d'erreur détaillés :
  - `InsufficientStockException` avec détail par article
  - `InactiveItemException` avec suggestion de remplacement
  - `ConcurrentModificationException` avec retry
  - `BusinessRuleViolationException` avec règle violée
- [ ] Extension du contrôleur Vouchers :
  - `GET /api/v1/vouchers/:id/validation-check` (pré-validation)
  - Amélioration endpoint validation avec erreurs détaillées
- [ ] Logs et audit :
  - Logging des tentatives de validation échouées
  - Audit trail des modifications de stock
  - Métriques sur les erreurs de validation
- [ ] Tests unitaires Jest :
  - Tests de validation avec stocks insuffisants
  - Tests d'articles archivés
  - Tests de concurrence (mock)
  - Tests de règles métier
  - Tests de messages d'erreur
  - Scenarios de gestion d'erreurs complexes

## Tests d'Acceptation

- [ ] Validation refuse stocks insuffisants avec message détaillé
- [ ] Validation refuse articles archivés
- [ ] Gestion correcte de la concurrence
- [ ] Messages d'erreur explicites et actionables
- [ ] Pré-validation disponible avant validation finale
- [ ] Logs des erreurs pour debugging
- [ ] Retry automatique sur conflits temporaires
- [ ] Tests unitaires passants (coverage > 80%)

## Fichiers à Créer/Modifier

- `backend/src/modules/vouchers/services/voucher-validator.service.ts` (étendu)
- `backend/src/modules/vouchers/exceptions/insufficient-stock.exception.ts`
- `backend/src/modules/vouchers/exceptions/inactive-item.exception.ts`
- `backend/src/modules/vouchers/exceptions/concurrent-modification.exception.ts`
- `backend/src/modules/vouchers/exceptions/business-rule-violation.exception.ts`
- `backend/src/modules/vouchers/dto/validation-error-response.dto.ts`
- `backend/src/modules/vouchers/dto/pre-validation-response.dto.ts`
- `backend/src/modules/vouchers/vouchers.controller.ts` (endpoint pré-validation)
- `backend/src/modules/vouchers/vouchers.service.ts` (gestion concurrence)
- `backend/src/modules/vouchers/interceptors/validation-logging.interceptor.ts`
- `backend/src/modules/vouchers/services/voucher-validator.service.spec.ts`
- `backend/src/modules/vouchers/exceptions/exceptions.spec.ts`