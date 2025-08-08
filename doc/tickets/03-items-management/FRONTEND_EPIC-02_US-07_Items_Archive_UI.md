# FRONTEND_EPIC-02_US-07 : Archivage et historique

**Epic**: FRONTEND EPIC-02 Interface Articles  
**Story Points**: 4  
**Sprint**: 5  
**Assigné**: Frontend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux archiver les articles obsolètes avec confirmation et accéder à l'historique complet pour maintenir une base de données propre tout en conservant la traçabilité.

## Critères d'Acceptation

**GIVEN** j'ai un article que je n'utilise plus  
**WHEN** je demande son archivage  
**THEN** une confirmation s'affiche avec les implications  
**AND** l'article est archivé et disparaît de la liste active  

**GIVEN** j'ai archivé un article par erreur  
**WHEN** j'accède aux articles archivés  
**THEN** je peux le restaurer facilement  
**AND** il redevient actif immédiatement  

**GIVEN** je consulte un article  
**WHEN** j'accède à son historique  
**THEN** je vois toutes les modifications avec dates et utilisateurs  

## Spécifications UI/UX

### Action d'Archivage depuis Liste
```
┌─────────────────────────────────────────────────────────────┐
│ Code    │ Nom              │ Catégorie │ Stock │ Actions      │
├─────────┼──────────────────┼───────────┼───────┼──────────────┤
│ USB001  │ Clé USB 32GB     │ Électro   │  45   │ [✏️] [📦] [🗑️] │
│                                               └─ Archive     │
└─────────────────────────────────────────────────────────────┘
```

### Modal Confirmation Archivage
```
┌─────────────────────────────────────────┐
│ 📦 Archiver l'Article      [✕]          │
├─────────────────────────────────────────┤
│                                         │
│ Vous allez archiver :                   │
│ 🔹 USB001 - Clé USB 32GB               │
│                                         │
│ ⚠️ Cet article a encore 45 unités en    │
│    stock et 3 mouvements ce mois.       │
│                                         │
│ Conséquences :                          │
│ • N'apparaîtra plus dans les listes    │
│ • Historique conservé                   │
│ • Peut être restauré ultérieurement    │
│ • Les mouvements passés restent visibles│
│                                         │
│ ☐ Je confirme comprendre les implications│
│                                         │
│          [Annuler]    [Archiver]        │
└─────────────────────────────────────────┘
```

### Vue Articles Archivés
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Articles Archivés                           [← Retour Articles] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [🔍 Rechercher dans archivés...]                            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Code    │ Nom         │ Archivé le  │ Par    │ Actions    │ │
│ ├─────────┼─────────────┼─────────────┼────────┼────────────┤ │
│ │ OLD001  │ Ancien Item │ 15/01/2024  │ J.Doe  │ [👁️] [↩️]  │ │
│ │ DEP002  │ Obsolète    │ 12/01/2024  │ M.Test │ [👁️] [↩️]  │ │
│ └─────────┴─────────────┴─────────────┴────────┴────────────┘ │
│                                                             │
│ 📊 23 articles archivés                                     │
└─────────────────────────────────────────────────────────────┘
```

### Historique Article (Onglet Détail)
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 USB001 - Clé USB 32GB                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Informations] [Stock] [Historique] [Mouvements]           │
│                         ────────────                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅 Historique des Modifications                         │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ 🕐 15/01/2024 14:30 par John Doe                       │ │
│ │    Stock minimum: 5 → 10                               │ │
│ │                                                         │ │
│ │ 🕐 12/01/2024 09:15 par Marie Test                     │ │
│ │    Description modifiée                                 │ │
│ │    Catégorie: Informatique → Électronique              │ │
│ │                                                         │ │
│ │ 🕐 08/01/2024 16:45 par John Doe                       │ │
│ │    Article créé                                         │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Action d'archivage :
  - Bouton archive dans liste et détail article
  - Modal de confirmation avec informations contextuelles
  - Vérification stock et mouvements récents
  - Checkbox confirmation obligatoire
- [ ] Vue articles archivés :
  - Page séparée avec liste filtrée
  - Recherche dans les articles archivés
  - Action de restauration avec confirmation
  - Lien retour vers articles actifs
- [ ] Historique des modifications :
  - Onglet dans page détail article
  - Timeline chronologique des changements
  - Détail des modifications (avant/après)
  - Informations utilisateur et date
- [ ] Hook de gestion :
  - `useItemArchive()` pour archivage/restauration
  - `useItemHistory()` pour historique modifications
  - Invalidation cache appropriée
- [ ] Intégration dans navigation :
  - Lien "Articles archivés" dans menu
  - Compteur d'articles archivés
  - Breadcrumb adapté selon la vue

## Intégration API Backend

### Endpoints utilisés
```
// Archivage/restauration
POST /api/v1/items/:id/archive
POST /api/v1/items/:id/restore

// Liste articles archivés
GET /api/v1/items?status=archived

// Historique article
GET /api/v1/items/:id/history

// Pré-vérification avant archivage
GET /api/v1/items/:id/archive-check
```

### Types TypeScript
```typescript
interface ArchiveCheckResponse {
  canArchive: boolean;
  warnings: string[];
  currentStock: number;
  recentMovements: number;
  lastMovementDate?: string;
}

interface ItemHistoryEntry {
  id: string;
  action: 'created' | 'updated' | 'archived' | 'restored';
  changes: Record<string, { from: any; to: any }>;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}
```

## Tests d'Acceptation

- [ ] Action archivage accessible depuis liste et détail
- [ ] Modal confirmation avec informations pertinentes
- [ ] Vérification pré-archivage (stock, mouvements)
- [ ] Articles archivés n'apparaissent plus dans liste active
- [ ] Vue articles archivés avec recherche fonctionnelle
- [ ] Restauration d'articles archivés
- [ ] Historique complet des modifications
- [ ] Timeline chronologique correcte
- [ ] Navigation fluide entre vues actives/archivées

## Fichiers à Créer

- `frontend/components/items/archive-item-modal.tsx`
- `frontend/components/items/archived-items-page.tsx`
- `frontend/components/items/item-history.tsx`
- `frontend/components/items/restore-item-modal.tsx`
- `frontend/hooks/use-item-archive.ts`
- `frontend/hooks/use-item-history.ts`
- `frontend/app/dashboard/articles/archives/page.tsx`
- `frontend/app/dashboard/articles/[id]/historique/page.tsx`