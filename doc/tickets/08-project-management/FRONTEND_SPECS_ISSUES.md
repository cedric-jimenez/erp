# Issues des Spécifications Frontend - À Traiter

## 🔴 Problèmes Critiques

### ✅ ISSUE-01 RÉSOLU : Incohérences avec le Backend
**Priorité**: ~~Critique~~ ✅ **TERMINÉ**

**Corrections apportées :**
- ✅ **Story Points alignés** : Frontend passé de 93 à 99 SP pour refléter la complexité UX/UI
- ✅ **APIs ajoutées** : `GET /items/check-code`, `POST /vouchers/draft`, `PUT /vouchers/:id/draft`, `POST /vouchers/:id/pre-validate`
- ✅ **Types harmonisés** : Interfaces frontend alignées avec réponses API backend
- ✅ **Dépendances clarifiées** : US frontend peuvent démarrer avec APIs de base disponibles

### ✅ ISSUE-02 RÉSOLU : Complexité UX Sous-estimée
**Priorité**: ~~Critique~~ ✅ **TERMINÉ**

**Corrections apportées :**
- ✅ **FRONTEND_US-12** : Passé de 12 à 18 SP avec détails (drag & drop react-beautiful-dnd, import CSV/Excel, scanner html5-qrcode, templates, mode plein écran)
- ✅ **Virtualisation détaillée** : react-window obligatoire si >5000 items, windowing buffer 100 items, tests perf (50k items <2s)
- ✅ **Responsive PME terrain** : Breakpoints spécifiés, boutons 44px+ touch-friendly, support tablettes robustes, gestes touch

### ✅ ISSUE-03 RÉSOLU : Spécifications Techniques Incomplètes
**Priorité**: ~~Critique~~ ✅ **TERMINÉ**

**Corrections apportées :**
- ✅ **Architecture state management** : Stores Zustand modulaires (auth, settings, UI), React Query avec stratégies cache/invalidation détaillées
- ✅ **Stratégie tests** : Configuration Jest+Testing Library, test utils, mocks MSW, coverage >85% composants
- ✅ **Performance** : Web Vitals tracking, budgets performance, lazy loading, bundle analysis
- ✅ **Error boundaries** : Error boundaries par module, logging Sentry, fallback UI
- ✅ **Documentation créée** : `FRONTEND_ARCHITECTURE_DETAILS.md` avec architecture complète

## 🟡 Problèmes Majeurs

### 🔄 ISSUE-04 EN COURS : User Stories Manquantes Importantes
**Priorité**: Majeure 🔄 **EN COURS (2/5)**

**Progress :**
- ✅ **US-14 Notifications temps réel** : WebSocket, toast notifications, desktop notifications, 13 SP
- ✅ **US-15 Mode hors ligne/PWA** : Service Worker, IndexedDB, background sync, Web App Manifest, 15 SP
- 🔄 **US-16 Import/Export CSV/Excel** : En cours de création, templates, validation, streaming export, ~11 SP
- ⏳ **US-17 Dashboard personnalisable** : Widgets configurables, préférences utilisateur (en attente)
- ⏳ **US-18 Impression/PDF** : Génération PDF bons/rapports, impression (en attente)

### ISSUE-05 : UX Incohérente Entre Modules
**Priorité**: Majeure  
**Impact**: Expérience utilisateur  

- **Patterns navigation** : Breadcrumb implémenté différemment selon US
- **Actions rapides** : Menus contextuels pas standardisés (icônes, placements)
- **Messages feedback** : Toast vs inline vs modal pas uniformisés
- **Loading states** : Skeleton loaders pas cohérents entre modules
- **Empty states** : Pas de specs pour états vides/première utilisation

### ISSUE-06 : Détails Techniques Manquants
**Priorité**: Majeure  
**Impact**: Architecture et maintenabilité  

- **Optimistic updates** : Stratégie mentionnée mais pas détaillée
- **Cache invalidation** : React Query mais pas de stratégie précise
- **Form validation** : Zod schemas mais pas d'architecture de validation globale
- **Routing** : App Router Next.js mais pas de structure de routes détaillée

## 🟠 Problèmes Mineurs

### ISSUE-07 : Accessibilité et Standards
**Priorité**: Mineure  
**Impact**: Conformité et inclusion  

- **WCAG compliance** : Mentionné mais pas de critères AA concrets
- **Navigation clavier** : Évoquée mais pas de specs détaillées
- **Screen readers** : Pas de stratégie ARIA labels
- **Contrast ratios** : Design system sans validation accessibilité

### ISSUE-08 : Spécifications Mobile/Tablette
**Priorité**: Mineure  
**Impact**: Usage terrain  

- **Touch gestures** : Swipe, pinch-to-zoom pas spécifiés
- **Offline capabilities** : Service Workers pas mentionnés
- **Performance mobile** : Pas de budget performance défini
- **PWA features** : Installation, notifications push

### ISSUE-09 : Monitoring et Analytics
**Priorité**: Mineure  
**Impact**: Suivi d'usage et erreurs  

- **Error tracking** : Sentry/similaire pas mentionné
- **User analytics** : Pas de stratégie de suivi d'usage
- **Performance monitoring** : Core Web Vitals pas spécifiés
- **A/B testing** : Pas prévu pour itérations UX

### ISSUE-10 : Documentation et Onboarding
**Priorité**: Mineure  
**Impact**: Adoption utilisateur  

- **Tooltips contextuels** : Pas de stratégie d'aide intégrée
- **Onboarding flow** : Première connexion pas spécifiée
- **Help center** : Documentation utilisateur pas prévue
- **Feedback utilisateur** : Pas de système de retours intégré

## Prochaines Étapes

### 🎯 Objectif Immédiat : Finaliser ISSUE-04
1. **Terminer US-16** : Import/Export CSV/Excel
2. **Créer US-17** : Dashboard personnalisable
3. **Créer US-18** : Impression/PDF

### 🕰️ Timeline Estimée
- **ISSUE-04 finalisé** : +2-3 heures
- **ISSUE-05 (UX patterns)** : +1-2 heures  
- **ISSUE-06 (specs techniques)** : +1 heure

---

## Plan de Traitement Original

### Phase 1 : Critiques (Avant Sprint Frontend)
- [x] ISSUE-01 : Alignment Backend/Frontend
- [x] ISSUE-02 : Révision estimations complexité
- [x] ISSUE-03 : Architecture technique détaillée

### Phase 2 : Majeurs (Sprint 1-2 Frontend)
- [🔄] ISSUE-04 : Création US manquantes prioritaires (En cours)
- [ ] ISSUE-05 : Standardisation patterns UX
- [ ] ISSUE-06 : Spécifications techniques complètes

### Phase 3 : Mineurs (Pendant développement)
- [ ] ISSUE-07 : Plan accessibilité
- [ ] ISSUE-08 : Optimisations mobile
- [ ] ISSUE-09 : Monitoring setup
- [ ] ISSUE-10 : Documentation utilisateur

---

**État actuel** : Issues 1-3 terminées. ISSUE-04 en cours (2/5 US créées).

## État d'Avancement Détaillé

### ✅ ISSUE-01 TERMINÉ : Incohérences Backend/Frontend
- Story Points alignés (FRONTEND_US-01: 8⇒10, US-04: 8⇒10, US-05: 8⇒10)
- APIs manquantes ajoutées (`GET /items/check-code`, endpoints voucher draft)
- Types TypeScript harmonisés entre frontend et backend

### ✅ ISSUE-02 TERMINÉ : Complexité UX Sous-estimée  
- FRONTEND_US-12 revu (12⇒18 SP) avec fonctionnalités détaillées
- Virtualisation 10k+ items spécifiée (react-window, tests perf)
- Contraintes responsive PME terrain ajoutées

### ✅ ISSUE-03 TERMINÉ : Spécifications Techniques Incomplètes
- Architecture Zustand + React Query détaillée
- Stratégie tests Jest + Testing Library complète
- Error boundaries et performance monitoring spécifiés
- **Fichier créé** : `FRONTEND_ARCHITECTURE_DETAILS.md`

### 🔄 ISSUE-04 EN COURS : User Stories Manquantes
**Progress : 2/5 US créées**
- ✅ US-14 : Notifications temps réel (WebSocket, toast, desktop notifications)
- ✅ US-15 : Mode hors ligne / PWA (Service Worker, IndexedDB, sync)
- 🔄 US-16 : Import/Export CSV/Excel (en cours de création)
- ⏳ US-17 : Dashboard personnalisable (en attente)
- ⏳ US-18 : Impression/PDF (en attente)