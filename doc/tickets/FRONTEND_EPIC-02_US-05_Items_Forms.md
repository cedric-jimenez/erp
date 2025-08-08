# FRONTEND_EPIC-02_US-05 : Formulaires de création/modification d'articles

**Epic**: FRONTEND EPIC-02 Interface Articles  
**Story Points**: 10  
**Sprint**: 4-5  
**Assigné**: Frontend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux créer et modifier des articles avec une interface simple, guidée et avec validation temps réel pour éviter les erreurs de saisie.

## Critères d'Acceptation

**GIVEN** je veux créer un nouvel article  
**WHEN** j'accède au formulaire de création  
**THEN** je vois un formulaire guidé avec champs obligatoires marqués  
**AND** la validation se fait en temps réel pendant la saisie  

**GIVEN** je saisis un code article déjà existant  
**WHEN** je quitte le champ code  
**THEN** un message d'erreur s'affiche immédiatement  
**AND** le bouton sauvegarder est désactivé  

**GIVEN** je modifie un article existant  
**WHEN** j'accède au formulaire de modification  
**THEN** tous les champs sont pré-remplis avec les valeurs actuelles  
**AND** je vois l'historique des modifications récentes  

## Spécifications UI/UX

### Formulaire Création Article
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Nouvel Article                          [Enregistrer] [Annuler] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Informations générales                                  │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ Code article *     [USB001________] ✓ Disponible        │ │
│ │ Nom article *      [Clé USB 32GB_________________]      │ │
│ │ Description        [____________________________]      │ │
│ │                    [____________________________]      │ │
│ │                                                         │ │
│ │ Catégorie *        [Électronique ▼]                     │ │
│ │ Unité              [Pièce ▼]                            │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Gestion des stocks                                      │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ Stock minimum *    [10___] pièces                       │ │
│ │ Stock initial      [0____] pièces (optionnel)           │ │
│ │                                                         │ │
│ │ ☐ Activer les alertes de stock bas                     │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ * Champs obligatoires                                       │
└─────────────────────────────────────────────────────────────┘
```

### États de validation
- **Champ valide** : Bordure verte avec ✓
- **Champ invalide** : Bordure rouge avec message d'erreur
- **Champ en cours** : Bordure bleue focus
- **Code unique** : Vérification temps réel avec debounce
- **Formulaire invalide** : Bouton sauvegarder désactivé + tooltip

### Formulaire Modification
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Modifier Article: USB001                [Sauvegarder] [Annuler] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Onglet: Informations] [Onglet: Historique]                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Formulaire pré-rempli identique à création]           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ⚠️ Cet article a des mouvements de stock                    │
│ La modification du code peut affecter l'historique         │
│                                                             │
│ Dernière modification: 15/01/2024 par John Doe             │
└─────────────────────────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Formulaire avec validation Zod :
  - Schema validation complet
  - Validation temps réel (onChange + onBlur)
  - Messages d'erreur localisés en français
  - Gestion des erreurs serveur
- [ ] Hook React Hook Form :
  - `useItemForm()` pour création/modification
  - Gestion état formulaire unifié
  - Reset et pré-remplissage automatique
  - Soumission avec optimistic updates
- [ ] Validation côté client :
  - Code article unique (debounce 500ms)
  - Champs obligatoires
  - Formats attendus (codes, nombres)
  - Cohérence stock minimum > 0
- [ ] Composants formulaire :
  - Input avec validation visuelle
  - Select catégories avec recherche
  - TextArea description auto-resize
  - NumberInput pour stocks avec validation
- [ ] UX avancée :
  - Auto-sauvegarde brouillon (localStorage)
  - Confirmation avant annulation si changes
  - Navigation clavier optimisée
  - Loading states pendant soumission
- [ ] Responsive design :
  - Layout formulaire mobile-friendly
  - Champs empilés sur petits écrans (320px+)
  - Boutons actions accessibles (min 44px touch)
  - Mode paysage tablette optimisé
  - Adaptation saisie terrain : gros boutons, éléments espacés
  - Support gants/stylus pour tablettes robustes
- [ ] Gestion des erreurs :
  - Validation serveur override client
  - Messages d'erreur contextuels
  - Retry automatique sur erreurs réseau

## Intégration API Backend

### Endpoints utilisés
```
// Vérification unicité code
GET /api/v1/items/check-code?code=USB001

// Création article
POST /api/v1/items
{
  code: string;
  name: string;
  description?: string;
  category_id: string;
  unit: string;
  stock_min: number;
  initial_stock?: number;
}

// Modification article
PUT /api/v1/items/:id
{
  // Mêmes champs que création
}

// Récupération catégories
GET /api/v1/categories
```

### Validation Schema Zod
```typescript
const itemFormSchema = z.object({
  code: z.string()
    .min(1, "Code obligatoire")
    .max(20, "Code trop long")
    .regex(/^[A-Z0-9]+$/, "Lettres majuscules et chiffres uniquement"),
    
  name: z.string()
    .min(1, "Nom obligatoire")
    .max(100, "Nom trop long"),
    
  description: z.string()
    .max(500, "Description trop longue")
    .optional(),
    
  category_id: z.string()
    .min(1, "Catégorie obligatoire"),
    
  unit: z.string()
    .min(1, "Unité obligatoire"),
    
  stock_min: z.number()
    .min(0, "Stock minimum doit être positif")
    .int("Doit être un nombre entier"),
    
  initial_stock: z.number()
    .min(0, "Stock initial doit être positif")
    .int("Doit être un nombre entier")
    .optional()
});
```

## Tests d'Acceptation

- [ ] Formulaire création accessible et fonctionnel
- [ ] Validation temps réel sur tous les champs
- [ ] Vérification unicité code article
- [ ] Pré-remplissage automatique en modification
- [ ] Auto-sauvegarde brouillon fonctionne
- [ ] Gestion des erreurs serveur
- [ ] Responsive design sur mobile/tablette
- [ ] Navigation clavier complète
- [ ] Confirmation avant annulation avec changes
- [ ] Loading states pendant soumissions

## Fichiers à Créer

- `frontend/components/items/item-form.tsx`
- `frontend/components/items/create-item-page.tsx`
- `frontend/components/items/edit-item-page.tsx`
- `frontend/components/forms/validated-input.tsx`
- `frontend/components/forms/validated-select.tsx`
- `frontend/components/forms/validated-textarea.tsx`
- `frontend/hooks/use-item-form.ts`
- `frontend/lib/items/item-validation.ts` (Zod schemas)
- `frontend/app/dashboard/articles/nouveau/page.tsx`
- `frontend/app/dashboard/articles/[id]/modifier/page.tsx`