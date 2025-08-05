# FRONTEND_EPIC-02_US-06 : Gestion des catégories

**Epic**: FRONTEND EPIC-02 Interface Articles  
**Story Points**: 5  
**Sprint**: 5  
**Assigné**: Frontend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux créer et organiser des catégories d'articles pour une meilleure structuration de mon inventaire avec une interface simple et efficace.

## Critères d'Acceptation

**GIVEN** je veux organiser mes articles  
**WHEN** j'accède à la gestion des catégories  
**THEN** je vois toutes mes catégories avec le nombre d'articles associés  
**AND** je peux créer, modifier ou supprimer des catégories  

**GIVEN** je veux supprimer une catégorie  
**WHEN** cette catégorie contient des articles  
**THEN** une confirmation s'affiche avec le nombre d'articles impactés  
**AND** je peux choisir une catégorie de remplacement  

## Spécifications UI/UX

### Interface Gestion Catégories
```
┌─────────────────────────────────────────────────────────────┐
│ 📂 Catégories d'Articles                    [+ Nouvelle Catégorie] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Nom                    │ Articles │ Dernière modif │ Actions │
│ ├─────────────────────────┼─────────┼────────────────┼────────┤ │
│ │ 📱 Électronique         │   247   │ 15/01/2024     │ [✏️][🗑️] │ │
│ │ 💼 Bureautique          │    89   │ 12/01/2024     │ [✏️][🗑️] │ │
│ │ 🔧 Outillage           │    34   │ 08/01/2024     │ [✏️][🗑️] │ │
│ │ 📦 Emballage           │     0   │ 05/01/2024     │ [✏️][🗑️] │ │
│ └─────────────────────────┴─────────┴────────────────┴────────┘ │
│                                                             │
│ 📊 4 catégories • 370 articles classés                      │
└─────────────────────────────────────────────────────────────┘
```

### Modal Création/Modification
```
┌─────────────────────────────────────────┐
│ ✨ Nouvelle Catégorie    [✕]             │
├─────────────────────────────────────────┤
│                                         │
│ Nom *           [Électronique_______]   │
│                                         │
│ Description     [Appareils et composants│
│                  électroniques_______]  │
│                                         │
│ Icône           [📱 ▼] Aperçu: 📱       │
│                                         │
│ ☐ Catégorie active                      │
│                                         │
│          [Annuler]    [Créer]           │
└─────────────────────────────────────────┘
```

### Modal Suppression avec Articles
```
┌─────────────────────────────────────────┐
│ ⚠️ Supprimer la Catégorie    [✕]         │
├─────────────────────────────────────────┤
│                                         │
│ Vous êtes sur le point de supprimer     │
│ la catégorie "Électronique".            │
│                                         │
│ ⚠️ Cette catégorie contient 247 articles│
│                                         │
│ Que souhaitez-vous faire ?              │
│                                         │
│ ○ Déplacer vers: [Bureautique ▼]        │
│ ○ Créer catégorie: [__________]         │
│ ○ Laisser sans catégorie                │
│                                         │
│          [Annuler]    [Supprimer]       │
└─────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Page gestion des catégories :
  - Liste des catégories avec compteurs d'articles
  - Actions CRUD avec confirmations appropriées
  - Tri par nom, nombre d'articles, date
  - Recherche dans les catégories
- [ ] Modals catégories :
  - Modal création avec validation
  - Modal modification avec pré-remplissage
  - Modal suppression avec gestion des articles
  - Validation Zod pour tous les formulaires
- [ ] Sélecteur d'icônes :
  - Liste prédéfinie d'icônes emoji
  - Aperçu temps réel
  - Icône par défaut si non sélectionnée
- [ ] Gestion des relations :
  - Vérification articles avant suppression
  - Migration des articles vers nouvelle catégorie
  - Option "sans catégorie" pour articles orphelins
- [ ] Hook de gestion :
  - `useCategories()` pour CRUD complet
  - Invalidation cache après modifications
  - Optimistic updates pour UX fluide
- [ ] États et feedbacks :
  - Loading states sur toutes les actions
  - Messages de succès/erreur avec toast
  - Confirmation avant actions destructives

## Intégration API Backend

### Endpoints utilisés
```typescript
// Liste des catégories avec compteurs
GET /api/v1/categories?include=itemCount

// CRUD catégories
POST /api/v1/categories
PUT /api/v1/categories/:id
DELETE /api/v1/categories/:id?moveToCategory=newId

// Vérification avant suppression
GET /api/v1/categories/:id/can-delete
```

### Types TypeScript
```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
  active?: boolean;
}

interface DeleteCategoryOptions {
  moveToCategory?: string;
  createNewCategory?: string;
  leaveOrphan?: boolean;
}
```

## Tests d'Acceptation

- [ ] Liste des catégories avec compteurs précis
- [ ] Création de catégorie avec validation
- [ ] Modification de catégorie fonctionnelle
- [ ] Suppression bloquée si articles associés
- [ ] Migration d'articles lors suppression
- [ ] Recherche dans les catégories
- [ ] Sélecteur d'icônes fonctionnel
- [ ] Messages de feedback appropriés
- [ ] Responsive design mobile/tablette

## Fichiers à Créer

- `frontend/components/categories/categories-list.tsx`
- `frontend/components/categories/category-modal.tsx`
- `frontend/components/categories/delete-category-modal.tsx`
- `frontend/components/categories/icon-selector.tsx`
- `frontend/hooks/use-categories.ts`
- `frontend/lib/categories/categories-api.ts`
- `frontend/lib/categories/category-validation.ts`
- `frontend/types/categories.ts`
- `frontend/app/dashboard/articles/categories/page.tsx`