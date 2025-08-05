# FRONTEND_EPIC-01_US-01 : Configuration Next.js + UI Framework

**Epic**: FRONTEND EPIC-01 Setup Architecture  
**Story Points**: 8  
**Sprint**: 2  
**Assigné**: Frontend Lead  

## User Story

En tant que **développeur frontend**, je veux un environnement Next.js avec Shadcn/UI pour développer rapidement des interfaces cohérentes et professionnelles.

## Critères d'Acceptation

**GIVEN** un projet vide  
**WHEN** je lance l'environnement de développement  
**THEN** Next.js démarre avec hot reload sur http://localhost:3000  
**AND** Shadcn/UI est configuré avec un thème PME cohérent  
**AND** TypeScript compile sans erreur  

**GIVEN** je veux créer un composant  
**WHEN** j'utilise les composants Shadcn/UI  
**THEN** ils respectent le design system défini  
**AND** ils sont responsive par défaut  

## Spécifications UI/UX

### Design System PME
- **Palette de couleurs** :
  - Primary: Blue-600 (#2563eb) - professionnel et trustworthy
  - Secondary: Slate-600 (#475569) - textes et éléments secondaires
  - Success: Green-600 (#16a34a) - validations, stock OK
  - Warning: Amber-500 (#f59e0b) - alertes stock bas
  - Error: Red-600 (#dc2626) - erreurs, stock critique
  - Background: Slate-50 (#f8fafc) - fond application

- **Typography** :
  - Font principale: Inter (lisible, moderne)
  - Tailles: xs(12px), sm(14px), base(16px), lg(18px), xl(20px)
  - Weights: normal(400), medium(500), semibold(600), bold(700)

- **Spacing** :
  - Grid 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
  - Container max-width: 1280px
  - Margins consistent: 16px mobile, 24px desktop

### Composants de base requis
- **Button** : variants (primary, secondary, outline, ghost)
- **Input** : avec états (default, focus, error, disabled)
- **Card** : container principal pour sections
- **Table** : pour listes d'articles, mouvements, bons
- **Badge** : pour statuts (active, archived, draft, validated)
- **Alert** : pour messages utilisateur
- **Loading Spinner** : état de chargement
- **Modal/Dialog** : confirmations et formulaires

## Tâches Techniques (Definition of Done)

- [ ] Initialisation Next.js 14 avec App Router
- [ ] Configuration TypeScript strict
- [ ] Installation et configuration Shadcn/UI :
  - `npx shadcn-ui@latest init`
  - Configuration tailwind.config.js avec thème PME
  - Installation composants de base requis
- [ ] Configuration des outils de développement :
  - ESLint avec règles Next.js et React
  - Prettier avec configuration équipe
  - Husky pour pre-commit hooks
- [ ] Structure des dossiers frontend :
  ```
  frontend/
  ├── app/                 # App Router Next.js
  ├── components/          # Composants réutilisables
  │   ├── ui/             # Composants Shadcn/UI
  │   └── layout/         # Layout components
  ├── lib/                # Utilities et configurations
  ├── hooks/              # Custom React hooks
  ├── store/              # Zustand stores
  └── types/              # TypeScript types
  ```
- [ ] Configuration environnements (.env.local, .env.example)
- [ ] Setup base layout avec Shadcn/UI
- [ ] Storybook pour documentation composants (optionnel)

## Tests d'Acceptation

- [ ] `npm run dev` démarre Next.js sans erreur
- [ ] `npm run build` compile avec succès
- [ ] `npm run lint` passe sans erreur
- [ ] Interface Shadcn/UI accessible et responsive
- [ ] Thème PME appliqué sur tous les composants
- [ ] Hot reload fonctionnel
- [ ] TypeScript strict activé et fonctionnel

## Fichiers à Créer

- `frontend/package.json`
- `frontend/next.config.js`
- `frontend/tsconfig.json`
- `frontend/tailwind.config.js` (avec thème PME)
- `frontend/components.json` (config Shadcn/UI)
- `frontend/.eslintrc.json`
- `frontend/.prettierrc`
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx`
- `frontend/app/globals.css`
- `frontend/lib/utils.ts`
- `frontend/components/ui/` (composants Shadcn/UI installés)

## Maquette Conceptuelle

```
┌─────────────────────────────────────────┐
│  ERP PME - Design System Preview       │
├─────────────────────────────────────────┤
│  [Button Primary] [Button Secondary]   │
│  [Button Outline] [Button Ghost]       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Card Component                      ││
│  │ ─────────────────────────────────── ││
│  │ Content with proper spacing         ││
│  │ [Badge: Active] [Badge: Warning]    ││
│  └─────────────────────────────────────┘│
│                                         │
│  Input: [___________________] [Search]  │
│  Alert: ⚠️ Système configuré avec succès│
└─────────────────────────────────────────┘
```