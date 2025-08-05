# FRONTEND_EPIC-01_US-02 : Authentification et routing

**Epic**: FRONTEND EPIC-01 Setup Architecture  
**Story Points**: 6  
**Sprint**: 3  
**Assigné**: Frontend Dev  

## User Story

En tant que **développeur frontend**, je veux un système d'authentification avec protection des routes pour sécuriser l'accès selon les rôles utilisateur.

## Critères d'Acceptation

**GIVEN** je ne suis pas connecté  
**WHEN** j'accède à une page protégée  
**THEN** je suis redirigé vers la page de connexion  

**GIVEN** je suis connecté avec un token valide  
**WHEN** j'accède à une page autorisée pour mon rôle  
**THEN** la page s'affiche normalement  

**GIVEN** je suis Operator  
**WHEN** j'essaie d'accéder aux fonctions Admin  
**THEN** l'accès est refusé avec message explicite  

## Spécifications UI/UX

### Page de Connexion
```
┌─────────────────────────────────────────┐
│              ERP PME                    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │         Se connecter               ││
│  │ ─────────────────────────────────── ││
│  │                                    ││
│  │ Email    [________________]        ││
│  │ Mot de passe [________________]    ││
│  │              [☐] Se souvenir       ││
│  │                                    ││
│  │         [Se connecter]             ││
│  │                                    ││
│  │ Mot de passe oublié ?              ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### États d'authentification
- **Loading** : Spinner pendant vérification token
- **Error** : Messages d'erreur avec styling rouge
- **Success** : Redirection immédiate après connexion
- **Session expirée** : Modal avec option reconnexion

### Navigation selon rôles
- **Admin** : Accès complet (Dashboard, Articles, Stock, Bons, Utilisateurs)
- **Operator** : Accès limité (Dashboard, Articles lecture, Stock, Bons)
- **Guest** : Redirection automatique vers login

## Tâches Techniques (Definition of Done)

- [ ] Installation dépendances auth :
  - `@tanstack/react-query` pour API calls
  - `zustand` pour state management
  - `js-cookie` pour gestion cookies
  - `zod` pour validation formulaires
- [ ] Store Zustand pour authentification :
  - État utilisateur courant
  - Token JWT storage
  - Actions login/logout/refresh
  - Persistance dans localStorage/cookies
- [ ] Service API d'authentification :
  - `authService.login(credentials)`
  - `authService.logout()`
  - `authService.refreshToken()`
  - `authService.getCurrentUser()`
- [ ] Hook d'authentification :
  - `useAuth()` - état et actions auth
  - `useRequireAuth()` - protection de composants
  - `useRole()` - vérification rôles
- [ ] Composants auth :
  - `LoginForm` avec validation Zod
  - `ProtectedRoute` wrapper
  - `RoleGuard` pour restriction par rôle
- [ ] Pages et routing :
  - `/login` - formulaire de connexion
  - Middleware Next.js pour protection routes
  - Redirection automatique selon statut auth
- [ ] Gestion des erreurs :
  - Token expiré → redirect login
  - Erreurs réseau → retry avec feedback
  - Accès refusé → message explicite

## Tests d'Acceptation

- [ ] Connexion avec identifiants valides réussit
- [ ] Connexion avec identifiants invalides échoue avec message
- [ ] Routes protégées redirigent vers login si non connecté
- [ ] Restrictions par rôle respectées
- [ ] Token persisté après fermeture navigateur (remember me)
- [ ] Déconnexion nettoie le state et redirige
- [ ] Refresh token automatique avant expiration
- [ ] Messages d'erreur UX-friendly

## Intégration API Backend

### Endpoints utilisés
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/users/profile` - Profil utilisateur courant

### Structure des réponses
```typescript
// Login response
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'OPERATOR';
    name: string;
  };
}

// User profile
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR';
  name: string;
  created_at: string;
}
```

## Fichiers à Créer

- `frontend/lib/auth/auth-service.ts`
- `frontend/store/auth-store.ts`
- `frontend/hooks/use-auth.ts`
- `frontend/components/auth/login-form.tsx`
- `frontend/components/auth/protected-route.tsx`
- `frontend/components/auth/role-guard.tsx`
- `frontend/app/login/page.tsx`
- `frontend/middleware.ts` (Next.js middleware)
- `frontend/lib/auth/auth-schemas.ts` (Zod schemas)
- `frontend/types/auth.ts`