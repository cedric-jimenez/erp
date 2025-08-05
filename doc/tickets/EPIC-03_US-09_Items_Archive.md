# EPIC-03_US-09 : Archivage des articles

**Epic**: EPIC-03 Gestion Articles  
**Story Points**: 2  
**Sprint**: 5  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux archiver les articles obsolètes sans les supprimer pour conserver l'historique.

## Critères d'Acceptation

**GIVEN** j'ai un article que je n'utilise plus  
**WHEN** je l'archive  
**THEN** l'article n'apparaît plus dans la liste active  
**AND** il est toujours accessible dans l'historique  
**AND** ses mouvements de stock sont conservés  

**GIVEN** j'ai archivé un article par erreur  
**WHEN** je le restaure  
**THEN** il redevient actif et visible  

**GIVEN** je consulte les articles archivés  
**WHEN** j'accède à la vue archivée  
**THEN** je vois tous les articles archivés avec leur date d'archivage  

## Tâches Techniques (Definition of Done)

- [ ] Ajout du champ `archived_at` dans l'entity Item
- [ ] Migration Prisma pour le nouveau champ
- [ ] Extension du service Items :
  - `archive()` - Archiver un article
  - `restore()` - Restaurer un article archivé  
  - `findArchived()` - Liste des articles archivés
  - Modification `findAll()` pour exclure les archivés par défaut
- [ ] Extension du contrôleur Items :
  - `POST /api/v1/items/:id/archive` (archivage)
  - `POST /api/v1/items/:id/restore` (restauration)
  - `GET /api/v1/items/archived` (liste archivés)
- [ ] Logique métier :
  - Vérifier qu'un article peut être archivé (pas de mouvement récent)
  - Bloquer création de mouvements sur articles archivés
  - Permettre consultation de l'historique
- [ ] Tests unitaires :
  - Tests d'archivage/restauration
  - Tests de filtrage actifs/archivés
  - Tests de validation (mouvements récents)
  - Tests d'intégrité avec les mouvements de stock

## Tests d'Acceptation

- [ ] Archivage retire l'article de la liste active
- [ ] Article archivé reste accessible pour consultation
- [ ] Restauration remet l'article actif
- [ ] Date d'archivage enregistrée
- [ ] Historique mouvements conservé
- [ ] Liste séparée pour articles archivés
- [ ] Validation empêche archivage si mouvements récents
- [ ] Tests unitaires passants

## Fichiers à Modifier

- `backend/prisma/schema.prisma` (ajout archived_at)
- `backend/src/modules/items/entities/item.entity.ts`
- `backend/src/modules/items/items.service.ts` (méthodes archive)
- `backend/src/modules/items/items.controller.ts` (endpoints archive)
- `backend/src/modules/items/dto/query-items.dto.ts` (filtre archived)
- `backend/src/modules/items/items.service.spec.ts` (tests archive)
- `backend/prisma/migrations/add-archived-at-to-items.sql`