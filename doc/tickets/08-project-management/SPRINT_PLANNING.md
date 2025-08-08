# Sprint Planning - ERP Backend

## Paramètres de l'équipe

- **Taille équipe**: 2-3 développeurs
- **Durée sprint**: 2 semaines
- **Vélocité estimée**: 15-20 Story Points par sprint
- **Capacité totale**: ~8 sprints pour MVP complet

---

## Sprint 1-2: Infrastructure (21 SP)

**Objectif Sprint**: Mettre en place l'infrastructure technique complète

### User Stories sélectionnées:
- **US-01**: Configuration NestJS + Docker *(8 SP)*
- **US-02**: Base de données avec Prisma *(8 SP)*
- **US-03**: Fixtures et Factories de test *(5 SP)*

**Definition of Done Sprint**:
- [ ] Environnement Docker fonctionnel
- [ ] Base de données structurée avec seeds
- [ ] Système de tests avec fixtures
- [ ] Documentation technique mise à jour

---

## Sprint 3: Authentification (15 SP)

**Objectif Sprint**: Sécuriser l'accès au système

### User Stories prévues:
- **US-04**: Gestion des utilisateurs *(5 SP)*
- **US-05**: Authentification JWT *(10 SP)*

**Risks/Dependencies**:
- Dépend de Sprint 1-2 complété
- Complexité JWT à surveiller

---

## Sprint 4-5: Gestion Articles (18 SP)

**Objectif Sprint**: Base de données produits fonctionnelle

### User Stories prévues:
- **US-06**: CRUD Articles *(8 SP)*
- **US-07**: Recherche et filtrage *(5 SP)*
- **US-08**: Gestion des catégories *(3 SP)*
- **US-09**: Archivage des articles *(2 SP)*

---

## Sprint 5-6: Gestion Stocks (21 SP)

**Objectif Sprint**: Suivi temps réel des inventaires

### User Stories prévues:
- **US-10**: Suivi des mouvements de stock *(8 SP)*
- **US-11**: Calcul d'inventaire en temps réel *(8 SP)*
- **US-12**: Alertes de stock bas *(3 SP)*
- **US-13**: Rapports de stock *(2 SP)*

**Risks**: Performance sur gros volumes

---

## Sprint 6-7: Gestion Bons (25 SP)

**Objectif Sprint**: Processus complet de gestion des vouchers

### User Stories prévues:
- **US-14**: Création de bons multi-lignes *(10 SP)*
- **US-15**: Validation et génération mouvements *(8 SP)*
- **US-16**: Différents types de bons *(5 SP)*
- **US-17**: Contrôles de cohérence *(2 SP)*

**Complexité**: Sprint le plus complexe, logique métier importante

---

## Sprint 8: Finalisation (13 SP)

**Objectif Sprint**: Prêt pour production

### User Stories prévues:
- **US-18**: Documentation API complète *(5 SP)*
- **US-19**: Optimisations de performance *(5 SP)*
- **US-20**: Sécurité renforcée *(3 SP)*

---

## Planning Poker Guidelines

### Story Points Reference:
- **1 SP**: Tâche triviale (< 1h)
- **2 SP**: Tâche simple (2-4h)
- **3 SP**: Tâche standard (4-8h)
- **5 SP**: Tâche complexe (1-2 jours)
- **8 SP**: Tâche très complexe (2-3 jours)
- **13 SP**: Epic à découper

### Critères d'estimation:
- Complexité technique
- Risques identifiés
- Dépendances externes
- Connaissance du domaine