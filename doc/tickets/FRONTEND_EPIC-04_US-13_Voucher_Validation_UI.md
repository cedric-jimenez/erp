# FRONTEND_EPIC-04_US-13 : Validation et contrôles

**Epic**: FRONTEND EPIC-04 Interface Bons  
**Story Points**: 8  
**Sprint**: 7  
**Assigné**: Frontend Dev  

## User Story

En tant qu'**opérateur**, je veux valider mes bons avec vérification automatique des stocks et confirmation avant impact final pour éviter les erreurs et assurer la traçabilité.

## Critères d'Acceptation

**GIVEN** j'ai un bon en brouillon prêt  
**WHEN** je demande la validation  
**THEN** un aperçu complet des impacts s'affiche  
**AND** je dois confirmer explicitement avant validation finale  

**GIVEN** mon bon contient des erreurs (stock insuffisant)  
**WHEN** je tente la validation  
**THEN** les erreurs sont listées clairement  
**AND** je peux corriger directement ou forcer la validation  

**GIVEN** j'ai validé un bon par erreur  
**WHEN** j'accède aux actions du bon  
**THEN** je peux l'annuler dans un délai défini  
**AND** les impacts sont automatiquement inversés  

## Spécifications UI/UX

### Modal Pré-validation
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Valider le Bon BON-2024-001                    [✕]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📋 Résumé du Bon                                            │
│ ─────────────────────────────────────────────────────────── │
│ Type: Bon de Sortie • Date: 15/01/2024                     │
│ Motif: Livraison client ABC                                 │
│ 2 lignes • 60 articles au total                            │
│                                                             │
│ 📊 Impact sur les Stocks                                    │
│ ─────────────────────────────────────────────────────────── │
│ ✅ USB001: 45 → 35 (OK, reste 35)                          │
│ ⚠️ KEY123: 12 → 2 (Attention: proche du minimum 5)         │
│                                                             │
│ 🔔 Alertes                                                  │
│ ─────────────────────────────────────────────────────────── │
│ • KEY123 passera sous le seuil minimum après cette opération│
│ • Considérez une commande de réapprovisionnement           │
│                                                             │
│ ☐ Je confirme avoir vérifié les quantités                  │
│ ☐ J'accepte les impacts sur les stocks                     │
│                                                             │
│          [Retour] [Corriger] [Valider Définitivement]      │
└─────────────────────────────────────────────────────────────┘
```

### Modal avec Erreurs Bloquantes
```
┌─────────────────────────────────────────────────────────────┐
│ ❌ Validation Impossible                           [✕]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🚫 Erreurs Critiques                                        │
│ ─────────────────────────────────────────────────────────── │
│ • MOU456: Stock insuffisant (demandé: 25, disponible: 8)   │
│ • ART789: Article archivé, ne peut pas être utilisé        │
│                                                             │
│ ⚠️ Avertissements                                           │
│ ─────────────────────────────────────────────────────────── │
│ • USB001: Stock sera proche du minimum (5 restant)         │
│                                                             │
│ 🔧 Actions Possibles                                        │
│ ─────────────────────────────────────────────────────────── │
│ • [Corriger les Quantités] Ajuster le bon                  │
│ • [Retirer les Articles] Supprimer lignes problématiques   │
│ • [Forcer la Validation] ⚠️ Admin uniquement               │
│                                                             │
│          [Retour au Bon] [Corriger Automatiquement]        │
└─────────────────────────────────────────────────────────────┘
```

### État Validé avec Actions
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 BON-2024-001 • ✅ Validé le 15/01/2024 14:30             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👤 Validé par: John Doe                                     │
│ 🎯 Motif: Livraison client ABC                              │
│ 📦 2 lignes • 60 articles                                   │
│                                                             │
│ 📊 Mouvements de Stock Générés                              │
│ ─────────────────────────────────────────────────────────── │
│ • MOV-001: USB001 -10 pièces                               │
│ • MOV-002: KEY123 -50 pièces                               │
│                                                             │
│ ⚡ Actions Rapides                                          │
│ ─────────────────────────────────────────────────────────── │
│ [📄 Imprimer] [📧 Envoyer] [🔄 Dupliquer] [❌ Annuler]     │
│                                                             │
│ ⏰ Annulation possible jusqu'au 16/01/2024 14:30           │
└─────────────────────────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Workflow de validation multi-étapes :
  - Pré-validation avec vérifications automatiques
  - Modal récapitulatif avec impacts détaillés
  - Confirmation explicite avec checkboxes
  - Validation finale avec feedback immédiat
- [ ] Système de vérifications :
  - API call pour validation côté serveur
  - Vérification stock disponible en temps réel
  - Contrôle articles actifs/archivés
  - Validation permissions utilisateur
- [ ] Gestion des erreurs et avertissements :
  - Classification erreurs bloquantes vs avertissements
  - Actions correctives suggérées
  - Option "forcer validation" pour Admins
  - Messages d'erreur contextuels et actionables
- [ ] États du bon après validation :
  - Affichage statut validé avec détails
  - Historique des validations/modifications
  - Actions post-validation (imprimer, dupliquer, annuler)
  - Délai limite pour annulation automatique
- [ ] Annulation de bons validés :
  - Modal confirmation avec impacts inversés
  - Vérification délai d'annulation
  - Génération mouvements compensatoires
  - Traçabilité complète des annulations
- [ ] UX optimisée :
  - Loading states pendant validations
  - Animations de transition d'état
  - Notifications toast pour confirmations
  - Breadcrumb et navigation contextuelle

## Intégration API Backend

### Endpoints utilisés
```
// Pré-validation
POST /api/v1/vouchers/:id/pre-validate

// Validation finale
POST /api/v1/vouchers/:id/validate

// Annulation
POST /api/v1/vouchers/:id/cancel

// Vérification permissions
GET /api/v1/vouchers/:id/can-validate
GET /api/v1/vouchers/:id/can-cancel
```

### Types de réponse
```typescript
interface PreValidationResult {
  canValidate: boolean;
  errors: Array<{
    type: 'INSUFFICIENT_STOCK' | 'INACTIVE_ITEM' | 'PERMISSION_DENIED';
    message: string;
    itemId?: string;
    suggested_action?: string;
  }>;
  warnings: Array<{
    type: 'LOW_STOCK_WARNING' | 'MINIMUM_THRESHOLD';
    message: string;
    itemId?: string;
  }>;
  stockImpacts: Array<{
    itemId: string;
    itemName: string;
    currentStock: number;
    newStock: number;
    isUnderMinimum: boolean;
  }>;
}
```

## Tests d'Acceptation

- [ ] Pré-validation affiche impacts stock correctement
- [ ] Erreurs bloquantes empêchent validation
- [ ] Avertissements permettent validation avec confirmation
- [ ] Actions correctives fonctionnelles
- [ ] Validation finale génère mouvements de stock
- [ ] États du bon mis à jour immédiatement
- [ ] Annulation dans délai fonctionne
- [ ] Permissions respectées (Admin/Operator)
- [ ] Messages d'erreur clairs et actionables
- [ ] Performance acceptable sur bons complexes

## Fichiers à Créer

- `frontend/components/vouchers/voucher-pre-validation-modal.tsx`
- `frontend/components/vouchers/voucher-validation-errors.tsx`
- `frontend/components/vouchers/voucher-stock-impacts.tsx`
- `frontend/components/vouchers/validated-voucher-actions.tsx`
- `frontend/components/vouchers/cancel-voucher-modal.tsx`
- `frontend/hooks/use-voucher-validation.ts`
- `frontend/lib/vouchers/validation-utils.ts`
- `frontend/types/voucher-validation.ts`