# US-02 : Base de données avec Prisma

**Epic**: EPIC-01 Infrastructure  
**Story Points**: 8  
**Sprint**: 1-2  
**Assigné**: Backend Dev  

## User Story

En tant que **développeur**, je veux une base de données PostgreSQL avec Prisma ORM et des données de test pour commencer le développement.

## Critères d'Acceptation

**GIVEN** l'environnement Docker fonctionnel  
**WHEN** je lance les migrations Prisma  
**THEN** toutes les tables sont créées avec les bonnes relations  
**AND** les données de seed sont chargées  
**AND** le client Prisma est généré et injectable  

## Tâches Techniques (Definition of Done)

- [ ] Installation Prisma (`prisma`, `@prisma/client`)
- [ ] Initialisation Prisma (`npx prisma init`)
- [ ] Configuration de la connexion PostgreSQL
- [ ] Création du schéma Prisma (`schema.prisma`) :
  - Table `users` (id, email, password, role, created_at, updated_at)
  - Table `items` (id, code, name, description, unit, category, stock_min, active, created_at, updated_at)
  - Table `vouchers` (id, number, date, type, status, reason, user_id, created_at, updated_at)
  - Table `voucher_lines` (id, voucher_id, item_id, quantity, created_at, updated_at)
  - Table `stock_movements` (id, item_id, voucher_id, quantity, type, created_at)
  - Relations: User 1→n Voucher, Voucher 1→n VoucherLine, Item 1→n VoucherLine, Item 1→n StockMovement
- [ ] Génération du client Prisma
- [ ] Configuration du module Prisma dans NestJS
- [ ] Scripts de migration et seeding :
  - Seed utilisateurs (Admin par défaut, Operators de test)
  - Seed catégories d'items (Électronique, Bureautique, etc.)
  - Seed items de démonstration (20-30 items variés)
  - Seed vouchers d'exemple (entrées, sorties)
  - Seed mouvements de stock initiaux

## Tests d'Acceptation

- [ ] `npx prisma migrate dev` réussit
- [ ] `npx prisma db seed` charge les données
- [ ] Client Prisma injectable dans les modules
- [ ] Toutes les relations fonctionnelles

## Fichiers à Créer

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`
- `backend/prisma/seed.ts`
- `backend/prisma/fixtures/` (données pour tests)
- `backend/prisma/reset.ts`
- `backend/src/prisma/prisma.module.ts`
- `backend/src/prisma/prisma.service.ts`