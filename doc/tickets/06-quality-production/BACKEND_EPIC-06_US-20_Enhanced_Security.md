# EPIC-06_US-20 : Sécurité renforcée

**Epic**: EPIC-06 Qualité/Production  
**Story Points**: 3  
**Sprint**: 8  
**Assigné**: Backend Dev  

## User Story

En tant qu'**administrateur système**, je veux que le système soit sécurisé contre les attaques courantes (CORS, rate limiting, etc.).

## Critères d'Acceptation

**GIVEN** un attaquant tente de faire du brute force sur l'authentification  
**WHEN** il fait plus de 5 tentatives en 1 minute  
**THEN** son IP est temporairement bloquée  
**AND** une alerte est générée  

**GIVEN** une requête provient d'un domaine non autorisé  
**WHEN** elle tente d'accéder à l'API  
**THEN** elle est rejetée par CORS  

**GIVEN** je configure le système pour la production  
**WHEN** j'active les mesures de sécurité  
**THEN** tous les headers de sécurité sont présents  
**AND** les informations sensibles sont masquées  

## Tâches Techniques (Definition of Done)

- [ ] Protection contre les attaques :
  - Rate limiting global et par endpoint
  - Protection brute force sur authentification
  - Validation et sanitisation stricte des entrées
  - Protection contre injection SQL (via Prisma)
  - Validation des tailles de requêtes (body size limit)
- [ ] Configuration CORS :
  - Domaines autorisés configurables par environnement
  - Méthodes HTTP limitées selon les besoins
  - Headers autorisés restreints
  - Credentials handling sécurisé
- [ ] Headers de sécurité :
  - Helmet.js avec configuration complète
  - Content Security Policy (CSP)
  - X-Frame-Options, X-Content-Type-Options
  - Strict-Transport-Security pour HTTPS
- [ ] Gestion des secrets :
  - Variables d'environnement pour tous les secrets
  - Validation de la présence des variables requises
  - Rotation des secrets JWT
  - Masquage des informations sensibles dans les logs
- [ ] Monitoring de sécurité :
  - Logs des tentatives d'intrusion
  - Métriques de sécurité (tentatives d'auth, rate limiting)
  - Alerts sur comportements suspects
  - Health checks de sécurité
- [ ] Configuration environnement :
  - Configuration différenciée dev/staging/prod
  - Durcissement pour environnement de production
  - Désactivation des endpoints de debug en prod
  - Validation de la configuration de sécurité

## Tests d'Acceptation

- [ ] Rate limiting actif et fonctionnel
- [ ] CORS configuré pour domaines autorisés uniquement
- [ ] Headers de sécurité présents dans toutes les réponses
- [ ] Protection brute force sur authentification
- [ ] Validation stricte des entrées utilisateur
- [ ] Secrets jamais exposés dans logs ou erreurs
- [ ] Monitoring de sécurité opérationnel
- [ ] Configuration production durcie

## Fichiers à Créer/Modifier

- `backend/src/main.ts` (configuration sécurité globale)
- `backend/src/config/security.config.ts`
- `backend/src/common/guards/throttler.guard.ts`
- `backend/src/common/guards/rate-limit.guard.ts`
- `backend/src/common/filters/security-exception.filter.ts`
- `backend/src/common/interceptors/security-headers.interceptor.ts`
- `backend/src/common/pipes/validation.pipe.ts` (sécurisé)
- `backend/src/common/middleware/security.middleware.ts`
- `backend/src/config/cors.config.ts`
- `backend/src/config/helmet.config.ts`
- `backend/src/health/security-health.indicator.ts`
- `backend/src/common/validators/` (validators sécurisés)
- `backend/test/security/` (tests de sécurité)
- `backend/.env.production.example` (template sécurisé)