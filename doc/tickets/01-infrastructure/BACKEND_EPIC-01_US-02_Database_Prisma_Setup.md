# US-02 : Connexion Database + Prisma

**Epic**: EPIC-01 Infrastructure  
**Story Points**: 5  
**Sprint**: 1-2  
**Assigné**: Backend Dev  
**Status**: 📋 TODO

## User Story

En tant que **développeur**, je veux une connexion PostgreSQL avec Prisma ORM fonctionnelle pour pouvoir développer les modules métier.

## Critères d'Acceptation

**GIVEN** l'environnement Docker fonctionnel  
**WHEN** je teste la connexion Prisma  
**THEN** la connexion PostgreSQL fonctionne  
**AND** le client Prisma est généré et injectable dans NestJS  
**AND** une table de test simple peut être créée  

## Tâches Techniques (Definition of Done)

- [ ] Installation Prisma (`prisma`, `@prisma/client`)
- [ ] Initialisation Prisma (`npx prisma init`)
- [ ] Configuration de la connexion PostgreSQL
- [ ] Création du schéma Prisma minimal (`schema.prisma`) :
  - Configuration du provider PostgreSQL
  - Table de test simple `health_check` (id, status, timestamp)
- [ ] Génération du client Prisma
- [ ] Configuration du module Prisma dans NestJS
- [ ] Test de connexion basique

## Tests d'Acceptation

- [ ] `npx prisma migrate dev` réussit
- [ ] Client Prisma injectable dans les modules NestJS
- [ ] Connexion PostgreSQL fonctionnelle
- [ ] Table de test créée et accessible

## Fichiers à Créer

- `backend/prisma/schema.prisma` (minimal)
- `backend/prisma/migrations/` (dossier auto-généré)
- `backend/src/prisma/prisma.module.ts`
- `backend/src/prisma/prisma.service.ts`