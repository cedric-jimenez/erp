# FRONTEND_EPIC-03_US-08 : Dashboard de stock

**Epic**: FRONTEND EPIC-03 Interface Stock  
**Story Points**: 8  
**Sprint**: 6  
**Assigné**: Frontend Dev  

## User Story

En tant que **gestionnaire de stock**, je veux un tableau de bord avec indicateurs clés (stock total, alertes, mouvements récents) pour avoir une vue d'ensemble de mon inventaire en temps réel.

## Critères d'Acceptation

**GIVEN** j'accède au tableau de bord stock  
**WHEN** la page se charge  
**THEN** je vois les KPI principaux mis à jour en temps réel  
**AND** les alertes de stock bas sont mises en évidence  

**GIVEN** je veux voir l'évolution sur une période  
**WHEN** je sélectionne une période (semaine, mois, trimestre)  
**THEN** les graphiques s'adaptent automatiquement  
**AND** les tendances sont clairement visibles  

## Spécifications UI/UX

### Dashboard Principal
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Tableau de Bord Stock    🔄 Actualisé il y a 2 min      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ 📦 Articles │ │ ⚠️ Alertes  │ │ 📈 Valorisation│ │ 🔄 Mouvements│ │
│ │    1,247    │ │     23      │ │   €127,450   │ │     156     │ │
│ │   articles  │ │ stock bas   │ │   inventaire │ │  ce mois    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                             │
│ ┌─────────────────────────────────┐ ┌─────────────────────────┐ │
│ │ 📈 Évolution Stock (30j)        │ │ ⚠️ Alertes Prioritaires  │ │
│ │ ─────────────────────────────── │ │ ───────────────────────  │ │
│ │     ╭─╮                        │ │                         │ │
│ │   ╭─╯ ╰╮  ╭╮                   │ │ 🔴 USB064: 0 unités     │ │
│ │ ╭─╯    ╰──╯╰╮                  │ │ 🟠 KEY123: 2/10         │ │
│ │╱           ╰─╮                 │ │ 🟠 MOU456: 5/15         │ │
│ │              ╰───              │ │                         │ │
│ │ Jan  Fév  Mar  Avr  Mai       │ │ [Voir toutes (20)]      │ │
│ └─────────────────────────────────┘ └─────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔄 Mouvements Récents                                   │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ 15/01 14:30  BON-001  Entrée   USB001  +50   J.Doe     │ │
│ │ 15/01 11:15  BON-002  Sortie   KEY123   -5   M.Test    │ │
│ │ 14/01 16:45  ADJ-003  Ajust.   MOU456  +10   J.Doe     │ │
│ │                                                         │ │
│ │ [Voir tout l'historique]                                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Widgets Détaillés

#### Widget KPI avec Tendances
```
┌─────────────────────────────┐
│ 📦 Articles Actifs          │
│ ─────────────────────────── │
│        1,247                │
│                             │
│ 📈 +23 ce mois             │
│ 📊 Répartition :           │
│    • Stock OK: 89%         │
│    • Stock bas: 8%         │
│    • Rupture: 3%           │
└─────────────────────────────┘
```

#### Graphique Interactif
```
┌─────────────────────────────────────────┐
│ 📈 Évolution Valorisation Stock         │
│ ─────────────────────────────────────── │
│ Période: [Cette semaine ▼]  [📅 Custom]│
│                                         │
│ €140k ┌─╮                              │
│      ╱  ╰╮                             │
│ €120k╱    ╰╮      ╭─╮                  │
│ €100k      ╰──────╯ ╰─╮                │
│ €80k                  ╰────            │
│                                         │
│ L  M  M  J  V  S  D                    │
│                                         │
│ 💡 +12% vs semaine précédente          │
└─────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Widgets KPI temps réel :
  - Composants métriques avec icônes et couleurs
  - Animations de transition pour changements
  - Indicateurs de tendance (↗️ ↘️ →)
  - Auto-refresh toutes les 30 secondes
- [ ] Graphiques interactifs :
  - Bibliothèque Recharts ou Chart.js
  - Graphiques responsive et accessibles
  - Sélecteur de période (7j, 30j, 90j, custom)
  - Tooltips informatifs au hover
- [ ] Liste mouvements récents :
  - Table scrollable avec derniers 10 mouvements
  - Codes couleur par type (IN/OUT/ADJUST)
  - Liens vers détail article et bon
  - Pagination ou scroll infini
- [ ] Système d'alertes :
  - Widget alertes prioritaires
  - Badges colorés par criticité
  - Actions rapides (marquer traité, voir détail)
  - Notifications en temps réel (WebSocket ou polling)
- [ ] Performance et optimisations :
  - Cache React Query avec stale-while-revalidate
  - Lazy loading des graphiques lourds
  - Debounce sur sélecteurs de période
  - Skeleton loaders pendant chargement
- [ ] Responsive design :
  - Layout mobile avec widgets empilés
  - Graphiques adaptés aux petits écrans
  - Navigation tactile optimisée

## Intégration API Backend

### Endpoints utilisés
```typescript
// KPI global
GET /api/v1/stock/dashboard

// Données graphiques
GET /api/v1/stock/evolution?period=30d&metric=value

// Mouvements récents
GET /api/v1/stock/movements/recent?limit=10

// Alertes prioritaires
GET /api/v1/stock/alerts?priority=high&limit=5
```

### Types TypeScript
```typescript
interface StockDashboard {
  kpis: {
    totalItems: number;
    totalValue: number;
    lowStockAlerts: number;
    monthlyMovements: number;
    trends: {
      items: number;      // % changement
      value: number;
      alerts: number;
      movements: number;
    };
  };
  stockDistribution: {
    normal: number;     // %
    low: number;        // %
    outOfStock: number; // %
  };
}

interface StockEvolution {
  period: string;
  data: Array<{
    date: string;
    value: number;
    quantity: number;
  }>;
}
```

## Tests d'Acceptation

- [ ] Dashboard se charge rapidement avec skeleton
- [ ] KPI affichent données temps réel
- [ ] Graphiques responsive et interactifs
- [ ] Auto-refresh fonctionne sans perturbation UX
- [ ] Alertes prioritaires mises en évidence
- [ ] Mouvements récents avec liens fonctionnels
- [ ] Sélecteur de période met à jour graphiques
- [ ] Performance acceptable sur mobile
- [ ] Navigation fluide vers détails

## Fichiers à Créer

- `frontend/components/stock/stock-dashboard.tsx`
- `frontend/components/stock/kpi-widget.tsx`
- `frontend/components/stock/stock-evolution-chart.tsx`
- `frontend/components/stock/recent-movements.tsx`
- `frontend/components/stock/priority-alerts.tsx`
- `frontend/hooks/use-stock-dashboard.ts`
- `frontend/lib/stock/stock-api.ts`
- `frontend/app/dashboard/stock/page.tsx`