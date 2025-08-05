# EPIC-02_US-04 : Gestion des utilisateurs

**Epic**: EPIC-02 Authentification  
**Story Points**: 5  
**Sprint**: 3  
**Assigné**: Backend Dev  

## User Story

En tant qu'**administrateur**, je veux créer et gérer les comptes utilisateurs pour contrôler qui accède au système.

## Critères d'Acceptation

**GIVEN** je suis connecté en tant qu'administrateur  
**WHEN** je crée un nouvel utilisateur avec email et rôle  
**THEN** l'utilisateur est créé avec un mot de passe hashé  
**AND** l'email est unique dans le système  
**AND** le rôle (Admin/Operator) est correctement assigné  

**GIVEN** je suis un utilisateur standard (Operator)  
**WHEN** je tente d'accéder à la gestion des utilisateurs  
**THEN** l'accès m'est refusé (403 Forbidden)  

## Tâches Techniques (Definition of Done)

- [ ] Création du module Users (`src/modules/users/`)
- [ ] Entity User (`user.entity.ts`)
- [ ] DTOs (`create-user.dto.ts`, `update-user.dto.ts`)
- [ ] Service Users (`users.service.ts`) :
  - CRUD des utilisateurs
  - Hashage des mots de passe avec bcrypt
  - Validation email unique
  - Gestion des rôles (Admin/Operator)
- [ ] Contrôleur Users (`users.controller.ts`) :
  - Routes CRUD protégées (Admin only)
  - `GET /api/v1/users/profile` (profil utilisateur courant)
  - `PUT /api/v1/users/profile/password` (changement mot de passe)
- [ ] Intégration avec le module Auth
- [ ] Tests unitaires Jest :
  - Tests du service Users (CRUD complet)
  - Tests de validation email unique
  - Tests de hashage des mots de passe
  - Tests de gestion des rôles
  - Mocks du service Prisma
  - Tests du contrôleur avec authentification
  - Fixtures utilisateurs (Admin, Operators, inactifs)
  - Factory pour création d'utilisateurs de test

## Tests d'Acceptation

- [ ] CRUD utilisateurs fonctionnel (Admin only)
- [ ] Emails uniques validés
- [ ] Mots de passe hashés avec bcrypt
- [ ] Endpoint profil utilisateur accessible
- [ ] Tests unitaires passants (coverage > 80%)
- [ ] Tests de sécurité (accès Admin only)

## Fichiers à Créer

- `backend/src/modules/users/users.module.ts`
- `backend/src/modules/users/entities/user.entity.ts`
- `backend/src/modules/users/dto/create-user.dto.ts`
- `backend/src/modules/users/dto/update-user.dto.ts`
- `backend/src/modules/users/users.service.ts`
- `backend/src/modules/users/users.controller.ts`
- `backend/src/modules/users/users.service.spec.ts`
- `backend/src/modules/users/users.controller.spec.ts`
- `backend/src/modules/users/dto/create-user.dto.spec.ts`