# FRONTEND_EPIC-02_US-04 : Liste et recherche d'articles

**Epic**: FRONTEND EPIC-02 Interface Articles  
**Story Points**: 8  
**Sprint**: 4  
**Assigné**: Frontend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux consulter et rechercher mes articles avec des filtres avancés pour les retrouver rapidement même dans un gros catalogue.

## Critères d'Acceptation

**GIVEN** j'ai 1000+ articles dans ma base  
**WHEN** je tape "USB" dans la recherche  
**THEN** les résultats s'affichent en temps réel avec debounce  
**AND** je vois les articles correspondants surlignés  

**GIVEN** je veux filtrer par catégorie "Électronique"  
**WHEN** je sélectionne ce filtre  
**THEN** seuls les articles de cette catégorie s'affichent  
**AND** le compteur total est mis à jour  

**GIVEN** je navigue dans la liste paginée  
**WHEN** je change de page  
**THEN** les filtres et recherche sont conservés  
**AND** l'URL reflète l'état actuel  

## Spécifications UI/UX

### Interface Liste Articles
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Articles                                    [+ Nouvel Article] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [🔍 Rechercher...]  [Catégorie ▼] [Statut ▼] [Stock bas ☐] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Code    │ Nom              │ Catégorie │ Stock │ Statut  │ │
│ ├─────────┼──────────────────┼───────────┼───────┼─────────┤ │
│ │ USB001  │ Clé USB 32GB     │ Électro   │  45   │ [Actif] │ │
│ │ USB002  │ Clé USB 64GB     │ Électro   │   3   │ [⚠️Bas] │ │
│ │ KEY001  │ Clavier Wireless │ Bureau    │  12   │ [Actif] │ │
│ │ MOU001  │ Souris Optique   │ Bureau    │   0   │ [🔴Vide]│ │
│ └─────────┴──────────────────┴───────────┴───────┴─────────┘ │
│                                                             │
│ 📄 Page 1 sur 42    [←] [1] [2] [3] ... [42] [→]           │
│ 🔢 1,652 articles au total • 23 en stock bas               │
└─────────────────────────────────────────────────────────────┘
```

### États visuels
- **Stock normal** : Badge vert "Actif"
- **Stock bas** : Badge orange "⚠️ Bas" (< stock_min)
- **Stock vide** : Badge rouge "🔴 Vide" (= 0)
- **Archivé** : Badge gris "📦 Archivé" (visible uniquement si filtre activé)

### Interactions
- **Click sur ligne** : Navigation vers détail article
- **Hover** : Surbrillance de la ligne
- **Actions rapides** : Menu contextuel (Modifier, Archiver, Voir stock)
- **Tri colonnes** : Click sur header pour trier
- **Sélection multiple** : Checkbox pour actions groupées

## Tâches Techniques (Definition of Done)

- [ ] Composant Liste Articles :
  - Table responsive avec tri par colonnes
  - Pagination avec navigation complète
  - Loading skeleton pendant chargement
  - États vides avec illustrations
- [ ] Barre de recherche et filtres :
  - Input recherche avec debounce 300ms
  - Dropdown catégories avec compteurs
  - Filtres statut (Tous, Actifs, Archivés)
  - Checkbox "Stock bas uniquement"
  - Reset filters avec un click
- [ ] Hook de gestion des données :
  - `useItemsList()` avec React Query
  - Gestion pagination, filtres, tri
  - Cache intelligent des résultats
  - Invalidation lors modifications
- [ ] Gestion des URLs :
  - Paramètres URL pour filtres/pagination
  - Navigation browser history
  - Bookmarkable URLs
  - Restoration état après refresh
- [ ] Performance :
  - Virtualisation si >5000 items
  - Lazy loading des images (si présentes)
  - Optimisation re-renders
- [ ] Responsive design :
  - Table scrollable horizontalement sur mobile
  - Colonnes prioritaires visibles
  - Filtres collapsibles sur petits écrans

## Intégration API Backend

### Endpoints utilisés
```typescript
GET /api/v1/items?search=term&category=id&status=active&page=1&limit=20&sortBy=name&sortOrder=asc
```

### Paramètres de requête
```typescript
interface ItemsQueryParams {
  search?: string;           // Recherche textuelle
  category?: string;         // ID catégorie
  status?: 'active' | 'archived' | 'all';
  stockAlert?: boolean;      // Stock bas uniquement
  page?: number;             // Page courante
  limit?: number;            // Items par page
  sortBy?: 'name' | 'code' | 'category' | 'stock';
  sortOrder?: 'asc' | 'desc';
}
```

### Structure réponse
```typescript
interface ItemsListResponse {
  items: Array<{
    id: string;
    code: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
    currentStock: number;
    stockMin: number;
    status: 'active' | 'archived';
    lastMovement?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}
```

## Tests d'Acceptation

- [ ] Liste affiche tous les articles avec pagination
- [ ] Recherche temps réel fonctionne (debounce 300ms)
- [ ] Filtres par catégorie et statut opérationnels
- [ ] Tri par colonnes fonctionnel
- [ ] Pagination conserve filtres et recherche
- [ ] URLs bookmarkables avec tous les paramètres
- [ ] Performance acceptable sur 10,000+ items
- [ ] Responsive design sur mobile/tablette
- [ ] Loading states et erreurs gérés
- [ ] Actions rapides accessibles

## Fichiers à Créer

- `frontend/components/items/items-list.tsx`
- `frontend/components/items/items-search-bar.tsx`
- `frontend/components/items/items-filters.tsx`
- `frontend/components/items/items-table.tsx`
- `frontend/components/items/item-row.tsx`
- `frontend/components/items/items-pagination.tsx`
- `frontend/hooks/use-items-list.ts`
- `frontend/lib/items/items-api.ts`
- `frontend/types/items.ts`
- `frontend/app/dashboard/articles/page.tsx`