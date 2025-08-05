# EPIC-02 : Authentification et Gestion des Utilisateurs

**Epic Owner**: Product Owner
**Sprint**: 3
**Story Points Estimés**: 15 points

## Description de l'Epic

En tant qu'**administrateur système**, je veux un système d'authentification sécurisé avec gestion des rôles pour contrôler l'accès aux fonctionnalités selon les profils utilisateur.

## Valeur Métier

- Sécurité des données d'entreprise
- Contrôle d'accès granulaire (Admin/Operator)
- Traçabilité des actions utilisateur
- Base pour l'audit et la conformité

## User Stories

### US-04 : Gestion des utilisateurs
**Story Points**: 5
En tant qu'**administrateur**, je veux créer et gérer les comptes utilisateurs pour contrôler qui accède au système.

### US-05 : Authentification JWT
**Story Points**: 10
En tant qu'**utilisateur**, je veux me connecter de manière sécurisée et rester authentifié durant ma session de travail.

## Critères d'Acceptation de l'Epic

- [ ] Connexion/déconnexion fonctionnelle
- [ ] Rôles Admin et Operator implémentés
- [ ] Protection des routes sensibles
- [ ] Mots de passe sécurisés (bcrypt)
- [ ] Tests de sécurité passants

## Dépendances

- EPIC-01 (Infrastructure)

## Risques

- Complexité de la gestion des tokens JWT
- Tests de sécurité à valider