# Product Backlog - ERP Backend

## Vue d'ensemble du produit

**Vision**: Système ERP simple et efficace pour PME permettant la gestion des articles, stocks et bons de manière centralisée.

**Release Goal**: MVP fonctionnel avec gestion complète items/stocks/vouchers et authentification sécurisée.

---

## Epics et Roadmap

### 🏗️ EPIC-01: Infrastructure (Sprint 1-2) - 21 SP
Base technique: NestJS, Docker, Prisma, système de tests

### 🔐 EPIC-02: Authentification (Sprint 3) - 15 SP  
Connexion sécurisée, gestion utilisateurs, contrôle d'accès

### 📦 EPIC-03: Gestion Articles (Sprint 4-5) - 18 SP
CRUD articles, catégories, recherche, archivage

### 📊 EPIC-04: Gestion Stocks (Sprint 5-6) - 21 SP
Mouvements, inventaire temps réel, alertes stock bas

### 📋 EPIC-05: Gestion Bons (Sprint 6-7) - 25 SP
Création bons multi-lignes, validation, génération mouvements

### 🚀 EPIC-06: Qualité/Production (Sprint 8) - 13 SP
Documentation, performance, sécurité

**Total**: 113 Story Points

---

## Sprint Planning

### Sprint 1-2: Infrastructure (21 SP)
- US-01: Configuration NestJS + Docker (8 SP)
- US-02: Base de données avec Prisma (8 SP)  
- US-03: Fixtures et Factories de test (5 SP)

### Sprint 3: Authentification (15 SP)
- US-04: Gestion des utilisateurs (5 SP)
- US-05: Authentification JWT (10 SP)

### Sprint 4-5: Articles (18 SP)
- US-06: CRUD Articles (8 SP)
- US-07: Recherche et filtrage (5 SP)
- US-08: Gestion des catégories (3 SP)
- US-09: Archivage des articles (2 SP)

### Sprint 5-6: Stocks (21 SP)
- US-10: Suivi des mouvements de stock (8 SP)
- US-11: Calcul d'inventaire en temps réel (8 SP)
- US-12: Alertes de stock bas (3 SP)
- US-13: Rapports de stock (2 SP)

### Sprint 6-7: Bons/Vouchers (25 SP)
- US-14: Création de bons multi-lignes (10 SP)
- US-15: Validation des bons et génération des mouvements (8 SP)
- US-16: Gestion des différents types de bons (5 SP)
- US-17: Contrôles de cohérence (2 SP)

### Sprint 8: Qualité/Production (13 SP)
- US-18: Documentation API complète (5 SP)
- US-19: Optimisations de performance (5 SP)
- US-20: Sécurité renforcée (3 SP)

---

## Definition of Ready (DoR)

✅ User Story avec critères d'acceptation clairs  
✅ Story Points estimés par l'équipe  
✅ Dépendances identifiées  
✅ Maquettes/spécifications disponibles si nécessaire  
✅ Tests d'acceptation définis  

## Definition of Done (DoD)

✅ Code développé selon les standards  
✅ Tests unitaires écrits et passants (coverage > 80%)  
✅ Tests d'intégration passants  
✅ Code review effectuée  
✅ Documentation mise à jour  
✅ Critères d'acceptation validés  
✅ Déployable en environnement de test  

---

## Risques identifiés

🔴 **Performance**: Calculs de stock sur gros volumes  
🟡 **Sécurité**: Complexité de la gestion JWT  
🟡 **Technique**: Configuration Docker multi-OS  

## Métriques de suivi

- **Vélocité équipe**: ~15-20 SP par sprint (à ajuster)
- **Burndown**: Suivi quotidien par sprint
- **Coverage tests**: Objectif > 80%
- **Bug rate**: < 5% des story points