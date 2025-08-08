# EPIC-03_US-07 : Recherche et filtrage d'articles

**Epic**: EPIC-03 Gestion Articles  
**Story Points**: 5  
**Sprint**: 4  
**Assigné**: Backend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux rechercher et filtrer les articles par code, nom ou catégorie pour les retrouver rapidement.

## Critères d'Acceptation

**GIVEN** j'ai une base de données avec de nombreux articles  
**WHEN** je tape "USB" dans la recherche  
**THEN** je vois tous les articles contenant "USB" dans le nom ou code  
**AND** les résultats sont triés par pertinence  

**GIVEN** je veux voir les articles d'une catégorie spécifique  
**WHEN** je sélectionne la catégorie "Électronique"  
**THEN** seuls les articles de cette catégorie s'affichent  

**GIVEN** je combine recherche et filtres  
**WHEN** je recherche "clavier" et filtre par catégorie "Bureautique"  
**THEN** je vois uniquement les claviers de bureautique  

## Tâches Techniques (Definition of Done)

- [ ] Amélioration du DTO de query (`query-items.dto.ts`) :
  - Paramètre `search` pour recherche textuelle
  - Paramètre `category` pour filtrage par catégorie
  - Paramètre `active` pour filtrer actifs/archivés
  - Paramètres de tri (`sortBy`, `sortOrder`)
- [ ] Amélioration du service Items :
  - Recherche full-text sur nom et code
  - Filtrage par catégorie
  - Tri configurable
  - Optimisation des requêtes Prisma
- [ ] Ajout d'endpoints spécialisés :
  - `GET /api/v1/items/search?q=term` (recherche rapide)
  - `GET /api/v1/items/categories` (liste des catégories)
- [ ] Indexation base de données :
  - Index sur colonnes `name` et `code`
  - Index sur `category`
- [ ] Tests de performance :
  - Tests avec datasets volumineux (1000+ items)
  - Validation temps de réponse < 200ms
- [ ] Tests unitaires étendus :
  - Tests de recherche textuelle
  - Tests de filtrage combiné
  - Tests de tri
  - Tests de performance

## Tests d'Acceptation

- [ ] Recherche textuelle fonctionne sur nom et code
- [ ] Filtrage par catégorie opérationnel
- [ ] Combinaison recherche + filtres
- [ ] Tri par nom, code, date de création
- [ ] Performance < 200ms sur 1000+ items
- [ ] Pagination cohérente avec filtres
- [ ] Gestion des caractères spéciaux
- [ ] Recherche insensible à la casse

## Fichiers à Modifier/Créer

- `backend/src/modules/items/dto/query-items.dto.ts` (extension)
- `backend/src/modules/items/items.service.ts` (méthodes search)
- `backend/src/modules/items/items.controller.ts` (endpoints search)
- `backend/prisma/schema.prisma` (ajout d'index)
- `backend/src/modules/items/items.service.spec.ts` (tests search)
- `backend/src/modules/items/items.controller.spec.ts` (tests endpoints)