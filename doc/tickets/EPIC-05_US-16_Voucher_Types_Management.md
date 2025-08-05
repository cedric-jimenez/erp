# EPIC-05_US-16 : Gestion des différents types de bons

**Epic**: EPIC-05 Gestion Bons  
**Story Points**: 5  
**Sprint**: 7  
**Assigné**: Backend Dev  

## User Story

En tant qu'**opérateur**, je veux créer différents types de bons (entrée, sortie, transfert, livraison) selon l'opération à effectuer.

## Critères d'Acceptation

**GIVEN** je reçois de la marchandise  
**WHEN** je crée un bon d'entrée  
**THEN** le bon génère des mouvements IN lors de la validation  
**AND** le stock des articles augmente  

**GIVEN** je dois livrer des produits  
**WHEN** je crée un bon de livraison  
**THEN** le bon génère des mouvements OUT lors de la validation  
**AND** le stock des articles diminue  

**GIVEN** je veux transférer entre entrepôts  
**WHEN** je crée un bon de transfert  
**THEN** le bon spécifie l'entrepôt source et destination  
**AND** génère des mouvements OUT (source) et IN (destination)  

## Tâches Techniques (Definition of Done)

- [ ] Définition des types de vouchers :
  - `ENTRY` - Bon d'entrée (réception marchandise)
  - `EXIT` - Bon de sortie (sortie interne)
  - `DELIVERY` - Bon de livraison (livraison client)
  - `TRANSFER` - Bon de transfert (entre entrepôts)
  - `ADJUSTMENT` - Bon d'ajustement (correction inventaire)
- [ ] Extension des entities :
  - Ajout champ `type` dans Voucher entity
  - Ajout champs `source_warehouse` et `destination_warehouse` (pour transferts)
  - Contraintes de validation selon le type
- [ ] Logique métier spécifique par type :
  - **ENTRY** : Pas de vérification stock, génère mouvements IN
  - **EXIT/DELIVERY** : Vérification stock disponible, génère mouvements OUT
  - **TRANSFER** : Vérification stock source, génère OUT + IN
  - **ADJUSTMENT** : Génère mouvements selon différence (+ ou -)
- [ ] Extension des DTOs :
  - `create-voucher.dto.ts` avec type obligatoire
  - Validation conditionnelle selon le type
  - DTOs spécifiques pour transferts (warehouses)
- [ ] Extension du service Vouchers :
  - `createEntry()` - Création bon d'entrée
  - `createExit()` - Création bon de sortie
  - `createDelivery()` - Création bon de livraison
  - `createTransfer()` - Création bon de transfert
  - `createAdjustment()` - Création bon d'ajustement
- [ ] Génération mouvements par type :
  - Factory pattern pour création mouvements selon type
  - Gestion des entrepôts multiples pour transferts
  - Calculs automatiques pour ajustements
- [ ] Extension du contrôleur Vouchers :
  - `POST /api/v1/vouchers/entry` (création entrée)
  - `POST /api/v1/vouchers/exit` (création sortie)
  - `POST /api/v1/vouchers/delivery` (création livraison)
  - `POST /api/v1/vouchers/transfer` (création transfert)
  - `GET /api/v1/vouchers/types` (liste des types disponibles)
- [ ] Tests unitaires Jest :
  - Tests de création par type
  - Tests de validation spécifique par type
  - Tests de génération mouvements par type
  - Tests de gestion des entrepôts (transferts)
  - Fixtures pour chaque type de voucher

## Tests d'Acceptation

- [ ] Tous les types de bons créables
- [ ] Validation spécifique par type fonctionnelle
- [ ] Génération correcte des mouvements selon le type
- [ ] Gestion des entrepôts pour transferts
- [ ] Contraintes métier respectées par type
- [ ] Filtrage par type dans les listes
- [ ] Documentation des types disponibles
- [ ] Tests unitaires passants (coverage > 80%)

## Fichiers à Modifier/Créer

- `backend/src/modules/vouchers/enums/voucher-type.enum.ts` (types complets)
- `backend/src/modules/vouchers/entities/voucher.entity.ts` (champs warehouse)
- `backend/src/modules/vouchers/dto/create-entry-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/create-exit-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/create-delivery-voucher.dto.ts`
- `backend/src/modules/vouchers/dto/create-transfer-voucher.dto.ts`
- `backend/src/modules/vouchers/services/voucher-type-factory.service.ts`
- `backend/src/modules/vouchers/services/movement-generator-factory.service.ts`
- `backend/src/modules/vouchers/vouchers.service.ts` (méthodes par type)
- `backend/src/modules/vouchers/vouchers.controller.ts` (endpoints par type)
- `backend/src/modules/vouchers/vouchers.service.spec.ts` (tests par type)
- `backend/prisma/schema.prisma` (champs warehouse dans vouchers)