# Commandes Importantes du Projet ERP

## Développement Backend
```bash
cd backend
yarn install
yarn start:dev          # Serveur de développement
yarn build              # Build de production
yarn start:prod         # Serveur de production
```

## Validation et Qualité
```bash
yarn typecheck          # Vérification TypeScript complète
yarn typecheck:src      # Vérification src/ seulement
yarn lint               # ESLint avec correction automatique
yarn format             # Formatting Prettier
```

## Tests
```bash
yarn test               # Tests unitaires
yarn test:watch         # Tests en mode watch
yarn test:cov           # Tests avec coverage
yarn test:e2e           # Tests end-to-end
yarn test:debug         # Tests en mode debug
```

## Docker (depuis la racine)
```bash
make up                 # Démarrer tous les services
make down               # Arrêter tous les services  
make urls               # Afficher toutes les URLs
docker-compose up --build
```

## URLs de Développement
- Backend API: http://localhost:3001
- Documentation Swagger: http://localhost:3001/api
- Health check: http://localhost:3001/health
- pgAdmin: http://localhost:5050

## Standards de Qualité
- **Coverage**: 70% branches, 90% functions/lines/statements
- **Manager de Packages**: TOUJOURS utiliser `yarn`, jamais `npm`
- **Conventions**: ESLint + Prettier avec single quotes et trailing commas