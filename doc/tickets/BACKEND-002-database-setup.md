# BACKEND-002 : Configuration Prisma et Base de Données

**Type**: Setup
**Priorité**: High
**Estimation**: 3-4h

## Description

Configurer Prisma ORM avec PostgreSQL et créer le schéma de base de données selon l'architecture définie.

## Tâches

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
- [ ] Scripts de migration et seeding

## Critères d'acceptation

- [ ] Base de données PostgreSQL connectée
- [ ] Toutes les tables créées avec les bonnes relations
- [ ] Client Prisma générée et injectable
- [ ] Migrations fonctionnelles
- [ ] Données de test chargées (seed)

## Fichiers à créer

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`
- `backend/prisma/seed.ts`
- `backend/src/prisma/prisma.module.ts`
- `backend/src/prisma/prisma.service.ts`