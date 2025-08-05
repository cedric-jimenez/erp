# Structure SCRUM - Documentation des Tickets

## Organisation des fichiers

### Convention de nommage
```
EPIC-XX_US-XX_Description.md
```

**Exemple**: `EPIC-01_US-01_NestJS_Docker_Setup.md`

### Structure des répertoires
```
doc/tickets/
├── EPIC-01_Infrastructure.md
├── EPIC-01_US-01_NestJS_Docker_Setup.md
├── EPIC-01_US-02_Database_Prisma_Setup.md
├── EPIC-01_US-03_Test_Fixtures_Factories.md
├── EPIC-02_Authentication.md
├── EPIC-02_US-04_User_Management.md
├── EPIC-02_US-05_JWT_Authentication.md
├── EPIC-03_Items_Management.md
├── EPIC-03_US-06_Items_CRUD.md
├── EPIC-03_US-07_Items_Search_Filter.md
├── EPIC-03_US-08_Categories_Management.md
├── EPIC-03_US-09_Items_Archive.md
├── PRODUCT_BACKLOG.md
├── SPRINT_PLANNING.md
└── README_SCRUM_STRUCTURE.md
```

## Mapping Epics → User Stories

### EPIC-01: Infrastructure (21 SP)
- `US-01`: Configuration NestJS + Docker (8 SP)
- `US-02`: Base de données avec Prisma (8 SP)  
- `US-03`: Fixtures et Factories de test (5 SP)

### EPIC-02: Authentification (15 SP)
- `US-04`: Gestion des utilisateurs (5 SP)
- `US-05`: Authentification JWT (10 SP)

### EPIC-03: Gestion Articles (18 SP)
- `US-06`: CRUD Articles (8 SP)
- `US-07`: Recherche et filtrage (5 SP)
- `US-08`: Gestion des catégories (3 SP)
- `US-09`: Archivage des articles (2 SP)

### EPIC-04: Gestion Stocks (21 SP)
- `US-10`: Suivi des mouvements de stock (8 SP)
- `US-11`: Calcul d'inventaire en temps réel (8 SP)
- `US-12`: Alertes de stock bas (3 SP)
- `US-13`: Rapports de stock (2 SP)

### EPIC-05: Gestion Bons (25 SP)
- `US-14`: Création de bons multi-lignes (10 SP)
- `US-15`: Validation des bons et génération des mouvements (8 SP)
- `US-16`: Gestion des différents types de bons (5 SP)
- `US-17`: Contrôles de cohérence (2 SP)

### EPIC-06: Qualité/Production (13 SP)
- `US-18`: Documentation API complète (5 SP)
- `US-19`: Optimisations de performance (5 SP)
- `US-20`: Sécurité renforcée (3 SP)

## Frontend Epics → User Stories

### FRONTEND_EPIC-01: Setup & Architecture (18 SP)
- `FRONTEND_US-01`: Configuration Next.js + UI Framework (8 SP)
- `FRONTEND_US-02`: Authentification et routing (6 SP)
- `FRONTEND_US-03`: Layout et navigation (4 SP)

### FRONTEND_EPIC-02: Interface Articles (25 SP)
- `FRONTEND_US-04`: Liste et recherche d'articles (8 SP)
- `FRONTEND_US-05`: Formulaires création/modification (8 SP)
- `FRONTEND_US-06`: Gestion des catégories (5 SP)
- `FRONTEND_US-07`: Archivage et historique (4 SP)

### FRONTEND_EPIC-03: Interface Stock (22 SP)
- `FRONTEND_US-08`: Dashboard de stock (8 SP)
- `FRONTEND_US-09`: Historique des mouvements (6 SP) *[À créer]*
- `FRONTEND_US-10`: Alertes de stock bas (5 SP) *[À créer]*
- `FRONTEND_US-11`: Rapports de stock (3 SP) *[À créer]*

### FRONTEND_EPIC-04: Interface Bons (28 SP)
- `FRONTEND_US-12`: Création de bons multi-lignes (12 SP)
- `FRONTEND_US-13`: Validation et contrôles (8 SP)
- `FRONTEND_US-14`: Liste et filtrage des bons (6 SP) *[À créer]*
- `FRONTEND_US-15`: Types de bons spécialisés (2 SP) *[À créer]*

## Usage des fichiers

### Epics (`EPIC-XX_Name.md`)
- Vue d'ensemble de l'epic
- Valeur métier apportée
- Liste des User Stories incluses
- Critères d'acceptation globaux
- Dépendances et risques

### User Stories (`EPIC-XX_US-XX_Name.md`)
- Détail d'une fonctionnalité utilisateur
- Critères d'acceptation GIVEN/WHEN/THEN
- Tâches techniques (Definition of Done)
- Tests d'acceptation
- Fichiers à créer/modifier

### Documents de gestion
- `PRODUCT_BACKLOG.md`: Vision produit et roadmap
- `SPRINT_PLANNING.md`: Planification des sprints
- `README_SCRUM_STRUCTURE.md`: Cette documentation

## Statut complet

**Créées**: Toutes les Epics et User Stories

**Backend**: 6 Epics, 20 User Stories, 113 Story Points
**Frontend**: 4 Epics, 9 User Stories créées, 93 Story Points

### Répartition Backend:
- **EPIC-01**: Infrastructure (3 US, 21 SP)
- **EPIC-02**: Authentification (2 US, 15 SP)  
- **EPIC-03**: Gestion Articles (4 US, 18 SP)
- **EPIC-04**: Gestion Stocks (4 US, 21 SP)
- **EPIC-05**: Gestion Bons (4 US, 25 SP)
- **EPIC-06**: Qualité/Production (3 US, 13 SP)

### Répartition Frontend:
- **FRONTEND_EPIC-01**: Setup & Architecture (3 US, 18 SP)
- **FRONTEND_EPIC-02**: Interface Articles (4 US, 25 SP)
- **FRONTEND_EPIC-03**: Interface Stock (1 US créée, 8 SP + 3 à créer)
- **FRONTEND_EPIC-04**: Interface Bons (2 US créées, 20 SP + 2 à créer)