# EPIC-05_US-15 : Validation des bons et génération des mouvements

**Epic**: EPIC-05 Gestion Bons  
**Story Points**: 8  
**Sprint**: 7  
**Assigné**: Backend Dev  

## User Story

En tant qu'**opérateur**, je veux valider mes bons en draft pour générer automatiquement les mouvements de stock correspondants.

## Critères d'Acceptation

**GIVEN** j'ai un bon d'entrée en draft avec des lignes  
**WHEN** je valide le bon  
**THEN** des mouvements de stock IN sont créés pour chaque ligne  
**AND** le statut du bon passe à "validated"  
**AND** le bon ne peut plus être modifié  

**GIVEN** j'ai un bon de sortie avec des articles  
**WHEN** je valide le bon  
**THEN** le système vérifie d'abord la disponibilité des stocks  
**AND** si suffisant, crée les mouvements OUT  
**AND** si insuffisant, refuse la validation avec un message explicite  

**GIVEN** j'ai validé un bon par erreur  
**WHEN** je tente de l'annuler (dans un délai court)  
**THEN** les mouvements sont inversés  
**AND** le bon repasse en draft  

## Tâches Techniques (Definition of Done)

- [ ] Extension du service Vouchers :
  - `validate(voucherId, userId)` - Validation d'un bon
  - `cancel(voucherId, userId)` - Annulation d'un bon validé
  - `checkStockAvailability(voucherId)` - Vérification disponibilité
  - `generateStockMovements(voucherId)` - Génération mouvements
  - `reverseStockMovements(voucherId)` - Inversion mouvements
- [ ] Logique métier de validation :
  - Vérification statut = DRAFT
  - Au moins une ligne présente
  - Articles des lignes existent et actifs
  - Pour EXIT/DELIVERY : vérification stock disponible
  - Génération numéro automatique de bon
- [ ] Intégration avec le module Stock :
  - Appel automatique création mouvements
  - Gestion des types selon le type de bon :
    - ENTRY → mouvements IN
    - EXIT/DELIVERY → mouvements OUT
    - TRANSFER → mouvements OUT + IN (multi-entrepôts)
- [ ] Extension du contrôleur Vouchers :
  - `POST /api/v1/vouchers/:id/validate` (validation)
  - `POST /api/v1/vouchers/:id/cancel` (annulation)
  - `GET /api/v1/vouchers/:id/stock-preview` (aperçu impact stock)
- [ ] Gestion des erreurs :
  - Stock insuffisant pour sorties
  - Bon déjà validé
  - Articles archivés dans les lignes
  - Permissions utilisateur
- [ ] Transactions base de données :
  - Atomicité validation + création mouvements
  - Rollback en cas d'erreur
- [ ] Tests unitaires Jest :
  - Tests de validation avec génération mouvements
  - Tests de vérification stock disponible
  - Tests d'annulation et inversion
  - Tests de gestion d'erreurs
  - Tests de transactions atomiques
  - Mocks des services Items et Stock

## Tests d'Acceptation

- [ ] Validation génère correctement les mouvements
- [ ] Vérification stock disponible pour sorties
- [ ] Numérotation automatique des bons
- [ ] Impossibilité modifier bon validé
- [ ] Annulation avec inversion des mouvements
- [ ] Gestion d'erreurs explicite
- [ ] Transactions atomiques (tout ou rien)
- [ ] Tests unitaires passants (coverage > 85%)
- [ ] Tests de validation des règles métier
- [ ] Tests des transactions de base de données

## Fichiers à Modifier/Créer

- `backend/src/modules/vouchers/vouchers.service.ts` (méthodes validation)
- `backend/src/modules/vouchers/vouchers.controller.ts` (endpoints validation)
- `backend/src/modules/vouchers/dto/validate-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/stock-preview-response.dto.ts`
- `backend/src/modules/vouchers/services/voucher-validator.service.ts`
- `backend/src/modules/vouchers/services/stock-movement-generator.service.ts`
- `backend/src/modules/vouchers/exceptions/insufficient-stock.exception.ts`
- `backend/src/modules/vouchers/exceptions/voucher-already-validated.exception.ts`
- `backend/src/modules/vouchers/vouchers.service.spec.ts` (tests validation)
- `backend/src/modules/vouchers/services/voucher-validator.service.spec.ts`