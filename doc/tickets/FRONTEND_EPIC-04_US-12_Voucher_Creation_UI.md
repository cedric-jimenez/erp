# FRONTEND_EPIC-04_US-12 : Création de bons multi-lignes

**Epic**: FRONTEND EPIC-04 Interface Bons  
**Story Points**: 12  
**Sprint**: 7  
**Assigné**: Frontend Dev  

## User Story

En tant qu'**opérateur**, je veux créer des bons avec plusieurs lignes d'articles via une interface intuitive avec auto-complétion et validation pour traiter efficacement mes opérations de stock.

## Critères d'Acceptation

**GIVEN** je veux créer un bon d'entrée  
**WHEN** j'accède au formulaire de création  
**THEN** je peux choisir le type de bon et ajouter des lignes dynamiquement  
**AND** l'auto-complétion m'aide à sélectionner les articles  

**GIVEN** je saisis une quantité supérieure au stock disponible  
**WHEN** je valide la ligne (pour un bon de sortie)  
**THEN** un avertissement s'affiche immédiatement  
**AND** je peux quand même continuer en mode brouillon  

**GIVEN** j'ai un brouillon en cours  
**WHEN** je quitte la page sans sauvegarder  
**THEN** une confirmation s'affiche pour éviter la perte de données  

## Spécifications UI/UX

### Formulaire Création Bon Multi-lignes
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Nouveau Bon                    [Brouillon] [Valider] [Annuler] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ En-tête du Bon                                          │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ Type *         [Bon d'Entrée ▼]                         │ │
│ │ Date           [15/01/2024 📅]                           │ │
│ │ Référence      [BON-2024-001___] (auto-généré)         │ │
│ │ Motif          [Réception fournisseur______________]    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📦 Lignes d'Articles                          [+ Ligne] │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ [🔍 Rechercher article...]                    [Scanner] │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │#│Article          │Unité│Qté │Stock│Total│Actions │ │ │
│ │ ├─┼─────────────────┼─────┼────┼─────┼─────┼────────┤ │ │
│ │ │1│USB001-Clé USB   │ pc  │ 50 │ 45  │ 50  │ [🗑️]  │ │ │
│ │ │ │                 │     │    │ ⚠️-5│     │       │ │ │
│ │ │2│KEY123-Clavier   │ pc  │ 10 │ 12  │ 10  │ [🗑️]  │ │ │
│ │ │3│[Article...▼]    │     │    │     │     │ [+]    │ │ │
│ │ └─┴─────────────────┴─────┴────┴─────┴─────┴────────┘ │ │
│ │                                                         │ │
│ │ 📊 2 lignes • 60 articles au total                     │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 💾 Brouillon auto-sauvegardé il y a 30s                    │
└─────────────────────────────────────────────────────────────┘
```

### Auto-complétion Articles
```
┌─────────────────────────────────────────┐
│ [🔍 USB_____________]                    │
├─────────────────────────────────────────┤
│ 📱 USB001 - Clé USB 32GB                │
│    Catégorie: Électronique • Stock: 45  │
│ 💾 USB002 - Clé USB 64GB                │
│    Catégorie: Électronique • Stock: 3   │
│ 🔌 USB003 - Câble USB-C                 │
│    Catégorie: Électronique • Stock: 28  │
│                                         │
│ [Créer nouvel article "USB..."]         │
└─────────────────────────────────────────┘
```

### Validation Temps Réel
```
┌─────────────────────────────────────────────────────────────┐
│ │1│USB001-Clé USB   │ pc  │ 50 │ 45  │ 50  │ [🗑️]      │
│ │ │⚠️ Quantité supérieure au stock disponible (45)      │
│ │ │💡 Stock après opération: -5 (rupture)               │
└─────────────────────────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Formulaire dynamique avec React Hook Form :
  - Gestion array de lignes avec useFieldArray
  - Validation en temps réel par ligne
  - Auto-sauvegarde brouillon toutes les 30s
  - Reset et pré-remplissage selon type de bon
- [ ] Auto-complétion articles avancée :
  - Recherche fuzzy avec debounce 300ms
  - Affichage code, nom, stock disponible
  - Navigation clavier (flèches, Enter, Escape)
  - Option création rapide nouvel article
- [ ] Gestion lignes dynamiques :
  - Ajout/suppression lignes fluide
  - Réorganisation par drag & drop
  - Duplication de ligne avec ajustements
  - Import CSV pour saisie en masse (bonus)
- [ ] Validation métier temps réel :
  - Vérification stock disponible pour sorties
  - Calculs automatiques (totaux, impacts)
  - Messages d'avertissement contextuels
  - Blocage validation si erreurs critiques
- [ ] Types de bons spécialisés :
  - Interface adaptée selon type (entrée/sortie/transfert)
  - Champs conditionnels (entrepôt source/destination)
  - Validation spécifique par type
- [ ] UX avancée :
  - Scanner code-barres (bonus avec caméra)
  - Saisie clavier optimisée (Tab, Enter)
  - Shortcuts pour actions fréquentes
  - Annulation avec confirmation si modifications

## Intégration API Backend

### Endpoints utilisés
```
// Auto-complétion articles
GET /api/v1/items/search?q=term&limit=10&includeStock=true

// Vérification stock disponible
GET /api/v1/stock/check-availability
{
  items: Array<{itemId: string, quantity: number}>
}

// Sauvegarde brouillon
POST /api/v1/vouchers/draft
PUT /api/v1/vouchers/:id/draft

// Création/validation bon
POST /api/v1/vouchers
POST /api/v1/vouchers/:id/validate
```

### Schema Validation Zod
```typescript
const voucherFormSchema = z.object({
  type: z.enum(['ENTRY', 'EXIT', 'TRANSFER', 'DELIVERY']),
  date: z.date(),
  reference: z.string().optional(), // Auto-généré
  reason: z.string().min(1, "Motif obligatoire"),
  sourceWarehouse: z.string().optional(),
  destinationWarehouse: z.string().optional(),
  lines: z.array(z.object({
    itemId: z.string().min(1, "Article obligatoire"),
    quantity: z.number().min(1, "Quantité doit être positive"),
    note: z.string().optional()
  })).min(1, "Au moins une ligne requise")
});
```

## Tests d'Acceptation

- [ ] Formulaire multi-lignes fonctionnel avec validation
- [ ] Auto-complétion articles rapide et précise
- [ ] Ajout/suppression lignes sans erreur
- [ ] Validation temps réel des quantités/stock
- [ ] Auto-sauvegarde brouillon fonctionne
- [ ] Types de bons avec interfaces adaptées
- [ ] Navigation clavier optimisée
- [ ] Responsive design sur tablette
- [ ] Performance acceptable avec 50+ lignes
- [ ] Gestion d'erreurs réseau robuste

## Fichiers à Créer

- `frontend/components/vouchers/voucher-form.tsx`
- `frontend/components/vouchers/voucher-header-form.tsx`
- `frontend/components/vouchers/voucher-lines-form.tsx`
- `frontend/components/vouchers/voucher-line-row.tsx`
- `frontend/components/vouchers/item-autocomplete.tsx`
- `frontend/components/vouchers/stock-validation-display.tsx`
- `frontend/hooks/use-voucher-form.ts`
- `frontend/hooks/use-item-search.ts`
- `frontend/lib/vouchers/voucher-validation.ts`
- `frontend/app/dashboard/bons/nouveau/page.tsx`