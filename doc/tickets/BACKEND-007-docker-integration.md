# BACKEND-007 : Intégration Docker et Docker Compose

**Type**: DevOps
**Priorité**: Medium
**Estimation**: 2-3h

## Description

Configurer Docker et Docker Compose pour l'environnement de développement complet avec PostgreSQL et pgAdmin.

## Tâches

- [ ] Finalisation du `Dockerfile` backend
- [ ] Création du `docker-compose.yml` racine :
  - Service backend (NestJS)
  - Service database (PostgreSQL)
  - Service pgAdmin
  - Volumes persistants pour la DB
- [ ] Configuration des variables d'environnement Docker
- [ ] Scripts de démarrage et d'arrêt
- [ ] Configuration des networks Docker
- [ ] Optimisation du build Docker (multi-stage)
- [ ] Documentation Docker dans README

## Critères d'acceptation

- [ ] `docker-compose up` démarre tous les services
- [ ] Backend accessible sur http://localhost:3001
- [ ] PostgreSQL fonctionnel avec données persistantes
- [ ] pgAdmin accessible sur http://localhost:5050
- [ ] Variables d'environnement correctement injectées
- [ ] Rebuild rapide en développement
- [ ] Documentation à jour

## Fichiers à créer/modifier

- `docker-compose.yml`
- `backend/Dockerfile` (optimisé)
- `.env.docker`
- `scripts/docker-start.sh`
- `scripts/docker-stop.sh`