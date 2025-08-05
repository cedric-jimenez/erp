# EPIC-06_US-18 : Documentation API complète

**Epic**: EPIC-06 Qualité/Production  
**Story Points**: 5  
**Sprint**: 8  
**Assigné**: Backend Dev  

## User Story

En tant que **développeur frontend** ou **intégrateur**, je veux une documentation API Swagger complète pour intégrer facilement les services.

## Critères d'Acceptation

**GIVEN** je veux intégrer l'API dans mon frontend  
**WHEN** j'accède à la documentation Swagger  
**THEN** je vois tous les endpoints avec leurs paramètres  
**AND** je peux tester directement les requêtes depuis l'interface  
**AND** les exemples de réponses sont complets et réalistes  

**GIVEN** je suis un nouveau développeur sur le projet  
**WHEN** je consulte la documentaion  
**THEN** je comprends rapidement comment utiliser chaque endpoint  
**AND** les modèles de données sont clairement définis  

## Tâches Techniques (Definition of Done)

- [ ] Configuration Swagger complète :
  - Métadonnées API (titre, version, description, contact)
  - Tags pour groupement logique des endpoints
  - Authentification JWT documentée avec exemples
  - Serveurs multiples (dev, staging, prod)
- [ ] Documentation des endpoints :
  - Descriptions détaillées pour chaque endpoint
  - Paramètres avec types, contraintes et exemples
  - Codes de réponse avec descriptions
  - Exemples de requêtes et réponses réalistes
- [ ] Documentation des modèles :
  - Schemas complets pour tous les DTOs
  - Relations entre modèles expliquées
  - Contraintes de validation documentées
  - Exemples de données pour chaque modèle
- [ ] Tests d'intégration étendus :
  - Tests pour tous les endpoints principaux
  - Tests d'authentification et autorisation
  - Tests de validation des données
  - Tests des codes d'erreur
- [ ] Amélioration de l'interface Swagger :
  - Interface personnalisée avec logo du projet
  - Groupement logique des endpoints
  - Exemples pré-remplis pour tests rapides
  - Export des spécifications OpenAPI
- [ ] Documentation complémentaire :
  - Guide de démarrage rapide
  - Exemples d'utilisation courants
  - Guide de gestion des erreurs
  - Changelog des versions API

## Tests d'Acceptation

- [ ] Documentation Swagger accessible et complète
- [ ] Tous les endpoints documentés avec exemples
- [ ] Authentification JWT testable depuis Swagger
- [ ] Modèles de données clairement définis
- [ ] Interface utilisable pour tests manuels
- [ ] Export OpenAPI fonctionnel
- [ ] Guide de démarrage disponible
- [ ] Tests d'intégration couvrant endpoints principaux

## Fichiers à Créer/Modifier

- `backend/src/main.ts` (configuration Swagger avancée)
- `backend/src/config/swagger.config.ts`
- `backend/src/common/decorators/api-response.decorator.ts`
- `backend/src/common/schemas/api-error.schema.ts`
- `backend/docs/api-guide.md`
- `backend/docs/quick-start.md`
- `backend/docs/error-handling.md`
- `backend/test/integration/` (tests e2e étendus)
- `backend/swagger-custom.css` (personnalisation interface)
- Amélioration tous les contrôleurs avec annotations Swagger complètes