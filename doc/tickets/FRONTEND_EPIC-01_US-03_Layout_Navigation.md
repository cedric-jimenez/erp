# FRONTEND_EPIC-01_US-03 : Layout et navigation

**Epic**: FRONTEND EPIC-01 Setup Architecture  
**Story Points**: 4  
**Sprint**: 3  
**Assigné**: Frontend Dev  

## User Story

En tant qu'**utilisateur**, je veux une navigation claire avec sidebar fixe pour accéder facilement aux différentes sections de l'ERP.

## Critères d'Acceptation

**GIVEN** je suis connecté à l'application  
**WHEN** j'accède à n'importe quelle page  
**THEN** je vois la sidebar navigation fixe à gauche  
**AND** l'élément de menu actuel est surligné  

**GIVEN** je suis sur mobile/tablette  
**WHEN** j'accède à l'application  
**THEN** la sidebar est collapsible avec bouton hamburger  
**AND** elle s'adapte à la taille d'écran  

**GIVEN** je clique sur un élément de menu  
**WHEN** je navigue vers une nouvelle section  
**THEN** la page se charge sans refresh complet  
**AND** le breadcrumb est mis à jour  

## Spécifications UI/UX

### Layout Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │   SIDEBAR   │ │              MAIN CONTENT             │ │
│ │             │ │                                       │ │
│ │ 🏠 Dashboard│ │  ┌─────────────────────────────────┐   │ │
│ │ 📦 Articles │ │  │         BREADCRUMB              │   │ │
│ │ 📊 Stock    │ │  ├─────────────────────────────────┤   │ │
│ │ 📋 Bons     │ │  │                                 │   │ │
│ │ 👥 Users    │ │  │         PAGE CONTENT            │   │ │
│ │             │ │  │                                 │   │ │
│ │             │ │  │                                 │   │ │
│ │             │ │  └─────────────────────────────────┘   │ │
│ │ [UserInfo]  │ │                                       │ │
│ │ [Logout]    │ │                                       │ │
│ └─────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Layout Mobile (≤768px)
```
┌─────────────────────────────────────────┐
│ [☰] ERP PME           [👤] [🔔] [⚙️] │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │         BREADCRUMB                  ││
│  ├─────────────────────────────────────┤│
│  │                                     ││
│  │         PAGE CONTENT                ││
│  │                                     ││
│  │                                     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Navigation Hierarchy
```
🏠 Dashboard
   └── Vue d'ensemble, KPIs, alertes

📦 Articles
   ├── Liste des articles
   ├── Créer un article
   ├── Catégories
   └── Articles archivés

📊 Stock  
   ├── Inventaire actuel
   ├── Mouvements
   ├── Alertes stock bas
   └── Rapports

📋 Bons
   ├── Liste des bons
   ├── Créer un bon
   │   ├── Bon d'entrée
   │   ├── Bon de sortie
   │   ├── Bon de transfert
   │   └── Bon de livraison
   └── Bons validés

👥 Utilisateurs (Admin uniquement)
   ├── Liste des utilisateurs
   └── Créer un utilisateur
```

## Tâches Techniques (Definition of Done)

- [ ] Layout principal responsive :
  - Sidebar fixe desktop (240px largeur)
  - Sidebar collapsible mobile avec overlay
  - Main content avec padding adaptatif
- [ ] Composant Sidebar :
  - Navigation avec icônes et labels
  - État actif avec surbrillance
  - Regroupement logique des menus
  - Animation smooth collapse/expand
- [ ] Header responsive :
  - Bouton toggle sidebar mobile
  - Breadcrumb dynamique
  - Actions utilisateur (profil, notifications, déconnexion)
- [ ] Navigation programmatique :
  - useRouter Next.js pour navigation
  - État actif basé sur pathname
  - Gestion des URLs avec paramètres
- [ ] Responsive design :
  - Breakpoints : mobile (<768px), tablet (768-1024px), desktop (>1024px)
  - Touch-friendly sur mobile/tablette
  - Gestures swipe pour sidebar mobile
- [ ] Permissions par rôle :
  - Masquage menu "Utilisateurs" pour Operator
  - Indicateurs visuels selon permissions
- [ ] États et animations :
  - Loading states pendant navigation
  - Animations CSS pour transitions
  - Focus management pour accessibilité

## Tests d'Acceptation

- [ ] Sidebar visible et fonctionnelle sur desktop
- [ ] Sidebar collapsible sur mobile avec toggle smooth
- [ ] Navigation entre pages sans refresh
- [ ] Breadcrumb mis à jour automatiquement
- [ ] État actif du menu correct sur toutes les pages
- [ ] Responsive design fluide sur toutes les tailles
- [ ] Permissions par rôle respectées dans navigation
- [ ] Accessibilité clavier fonctionnelle

## Composants à Créer

### Structure des composants
```typescript
// Layout principal
<AppLayout>
  <Sidebar />
  <MainContent>
    <Header />
    <Breadcrumb />
    <PageContent>
      {children}
    </PageContent>
  </MainContent>
</AppLayout>
```

## Fichiers à Créer

- `frontend/components/layout/app-layout.tsx`
- `frontend/components/layout/sidebar.tsx`
- `frontend/components/layout/header.tsx`
- `frontend/components/layout/breadcrumb.tsx`
- `frontend/components/layout/main-content.tsx`
- `frontend/components/navigation/nav-item.tsx`
- `frontend/components/navigation/nav-menu.tsx`
- `frontend/hooks/use-navigation.ts`
- `frontend/lib/navigation/menu-config.ts`
- `frontend/lib/navigation/breadcrumb-utils.ts`
- `frontend/app/dashboard/layout.tsx` (layout wrapper)