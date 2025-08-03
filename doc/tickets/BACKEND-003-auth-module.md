# BACKEND-003 : Module d'Authentification JWT

**Type**: Feature
**Priorité**: High
**Estimation**: 4-5h

## Description

Implémenter l'authentification JWT avec système de rôles (Admin/Operator) et protection des routes.

## Tâches

- [ ] Installation des dépendances auth :
  - `@nestjs/jwt`, `@nestjs/passport`
  - `passport`, `passport-jwt`, `passport-local`
  - `bcrypt` pour le hashage des mots de passe
- [ ] Création du module Auth (`src/modules/auth/`)
- [ ] Service d'authentification (`auth.service.ts`)
- [ ] Contrôleur d'authentification (`auth.controller.ts`)
- [ ] DTOs pour login/register (`auth.dto.ts`)
- [ ] Stratégies Passport (local + JWT)
- [ ] Guards pour la protection des routes (`jwt-auth.guard.ts`)
- [ ] Guard pour les rôles (`roles.guard.ts`)
- [ ] Décorateurs personnalisés (`@Roles()`, `@Public()`)

## Critères d'acceptation

- [ ] Endpoint `/api/v1/auth/login` fonctionnel
- [ ] Endpoint `/api/v1/auth/register` fonctionnel
- [ ] JWT généré et valide
- [ ] Routes protégées par authentification
- [ ] Système de rôles Admin/Operator fonctionnel
- [ ] Mots de passe hashés avec bcrypt

## Fichiers à créer

- `backend/src/modules/auth/auth.module.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/dto/auth.dto.ts`
- `backend/src/modules/auth/strategies/`
- `backend/src/common/guards/`
- `backend/src/common/decorators/`