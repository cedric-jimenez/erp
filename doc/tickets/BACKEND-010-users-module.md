# BACKEND-010 : Module Users (Gestion des Utilisateurs)

**Type**: Feature
**Priorité**: High
**Estimation**: 3-4h
**Dépendances**: BACKEND-002, BACKEND-003

## Description

Implémenter le module de gestion des utilisateurs avec CRUD et gestion des rôles (Admin/Operator).

## Tâches

- [ ] Création du module Users (`src/modules/users/`)
- [ ] Entity User (`user.entity.ts`)
- [ ] DTOs (`create-user.dto.ts`, `update-user.dto.ts`)
- [ ] Service Users (`users.service.ts`) :
  - CRUD des utilisateurs
  - Hashage des mots de passe
  - Validation email unique
  - Gestion des rôles
- [ ] Contrôleur Users (`users.controller.ts`) :
  - Routes CRUD protégées (Admin only)
  - Profil utilisateur courant
  - Changement de mot de passe
- [ ] Intégration avec le module Auth
- [ ] Tests unitaires

## Critères d'acceptation

- [ ] CRUD utilisateurs fonctionnel (Admin only)
- [ ] Emails uniques validés
- [ ] Mots de passe hashés
- [ ] Gestion des rôles Admin/Operator
- [ ] Endpoint profil utilisateur
- [ ] Tests unitaires complets

## Fichiers à créer

- `backend/src/modules/users/users.module.ts`
- `backend/src/modules/users/entities/user.entity.ts`
- `backend/src/modules/users/dto/`
- `backend/src/modules/users/users.service.ts`
- `backend/src/modules/users/users.controller.ts`
- `backend/src/modules/users/users.service.spec.ts`