# FRONTEND_US-01 : Configuration Next.js + Hello World

**Epic**: FRONTEND EPIC-01 Setup Architecture  
**Story Points**: 5  
**Sprint**: 2  
**Assigné**: Frontend Lead  
**Status**: 📋 TODO

## User Story

En tant que **développeur frontend**, je veux un environnement Next.js basique fonctionnel avec un "Hello World" pour pouvoir commencer le développement des fonctionnalités.

## Critères d'Acceptation

**GIVEN** un projet vide  
**WHEN** je lance l'environnement de développement  
**THEN** Next.js démarre avec hot reload sur http://localhost:3000  
**AND** une page "Hello World ERP" s'affiche  
**AND** TypeScript compile sans erreur  


## Tâches Techniques (Definition of Done)

- [ ] Initialisation Next.js 14 avec App Router
- [ ] Configuration TypeScript basique
- [ ] Configuration des outils de développement :
  - ESLint avec règles Next.js de base
  - Prettier avec configuration standard
- [ ] Structure des dossiers minimale :
  ```
  frontend/
  ├── app/                 # App Router Next.js
  │   ├── layout.tsx       # Layout de base
  │   ├── page.tsx         # Page Hello World
  │   └── globals.css      # CSS global
  ├── components/          # (dossier vide pour plus tard)
  └── lib/                 # (dossier vide pour plus tard)
  ```
- [ ] Page Hello World simple avec titre "Hello World ERP"
- [ ] Configuration environnements de base (.env.example)

## Tests d'Acceptation

- [ ] `npm run dev` démarre Next.js sans erreurs
- [ ] `npm run build` compile avec succès
- [ ] `npm run lint` passe sans erreurs
- [ ] Page "Hello World ERP" s'affiche à http://localhost:3000
- [ ] Hot reload fonctionnel
- [ ] TypeScript compile sans erreurs

## Fichiers à Créer

- `frontend/package.json`
- `frontend/next.config.js`
- `frontend/tsconfig.json`
- `frontend/.eslintrc.json`
- `frontend/.prettierrc`
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx` (avec "Hello World ERP")
- `frontend/app/globals.css`
- `frontend/.env.example`

## Maquette Hello World

```
┌─────────────────────────────────────────┐
│               Hello World ERP           │
│                                         │
│    Bienvenue dans le système ERP        │
│      Configuration technique OK          │
│                                         │
│        Next.js 14 + TypeScript         │
└─────────────────────────────────────────┘
```