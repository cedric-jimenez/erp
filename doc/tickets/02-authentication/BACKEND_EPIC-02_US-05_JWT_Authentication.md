# EPIC-02_US-05 : Authentification JWT

**Epic**: EPIC-02 Authentification  
**Story Points**: 10  
**Sprint**: 3  
**Assigné**: Backend Dev  

## User Story

En tant qu'**utilisateur**, je veux me connecter de manière sécurisée et rester authentifié durant ma session de travail.

## Critères d'Acceptation

**GIVEN** je suis un utilisateur enregistré  
**WHEN** je me connecte avec mes identifiants corrects  
**THEN** je reçois un token JWT valide  
**AND** je peux accéder aux routes protégées avec ce token  

**GIVEN** je suis connecté avec un token valide  
**WHEN** j'accède à une route protégée  
**THEN** ma requête est autorisée  
**AND** mes informations utilisateur sont disponibles  

**GIVEN** je tente d'accéder à une route nécessitant un rôle Admin  
**WHEN** je suis connecté comme Operator  
**THEN** l'accès m'est refusé (403 Forbidden)  

## Tâches Techniques (Definition of Done)

- [ ] Installation des dépendances auth :
  - `@nestjs/jwt`, `@nestjs/passport`
  - `passport`, `passport-jwt`, `passport-local`
  - `bcrypt` pour le hashage des mots de passe
- [ ] Création du module Auth (`src/modules/auth/`)
- [ ] Service d'authentification (`auth.service.ts`)
- [ ] Contrôleur d'authentification (`auth.controller.ts`)
- [ ] DTOs pour login/register (`login.dto.ts`, `register.dto.ts`)
- [ ] Stratégies Passport :
  - Stratégie locale pour login
  - Stratégie JWT pour authentification
- [ ] Guards pour la protection des routes :
  - `jwt-auth.guard.ts` (authentification)
  - `roles.guard.ts` (autorisation par rôle)
- [ ] Décorateurs personnalisés :
  - `@Roles(Role.ADMIN)` pour restriction de rôle
  - `@Public()` pour routes publiques
  - `@CurrentUser()` pour injection utilisateur courant
- [ ] Tests unitaires Jest :
  - Tests du service d'authentification
  - Tests des guards (JWT et rôles)
  - Tests des stratégies Passport
  - Mocks des dépendances (JwtService, UsersService)
  - Fixtures utilisateurs pour tests (Admin, Operator)
  - Fixtures JWT tokens valides/expirés

## Tests d'Acceptation

- [ ] `POST /api/v1/auth/login` retourne un JWT valide
- [ ] `POST /api/v1/auth/register` crée un utilisateur
- [ ] Routes protégées nécessitent un token valide
- [ ] Système de rôles Admin/Operator fonctionnel
- [ ] Mots de passe hashés avec bcrypt
- [ ] Tests unitaires passants (coverage > 80%)
- [ ] Tests de sécurité validés

## Fichiers à Créer

- `backend/src/modules/auth/auth.module.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/dto/login.dto.ts`
- `backend/src/modules/auth/dto/register.dto.ts`
- `backend/src/modules/auth/strategies/local.strategy.ts`
- `backend/src/modules/auth/strategies/jwt.strategy.ts`
- `backend/src/common/guards/jwt-auth.guard.ts`
- `backend/src/common/guards/roles.guard.ts`
- `backend/src/common/decorators/roles.decorator.ts`
- `backend/src/common/decorators/public.decorator.ts`
- `backend/src/common/decorators/current-user.decorator.ts`
- `backend/src/modules/auth/auth.service.spec.ts`
- `backend/src/common/guards/jwt-auth.guard.spec.ts`
- `backend/src/common/guards/roles.guard.spec.ts`