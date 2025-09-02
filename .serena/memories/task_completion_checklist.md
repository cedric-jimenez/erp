# Checklist de Fin de Tâche

## Validation Obligatoire
1. **Vérification TypeScript**
   ```bash
   yarn typecheck
   ```

2. **Linting avec correction**
   ```bash
   yarn lint
   ```

3. **Formatage du code**
   ```bash
   yarn format
   ```

4. **Tests (si applicable)**
   ```bash
   yarn test
   yarn test:cov  # Vérifier coverage ≥ 70/90%
   ```

## Pour les Nouvelles Fonctionnalités
1. **Tests unitaires** (controller + service)
2. **Tests e2e** (endpoints complets)
3. **Validation des DTOs** (edge cases)
4. **Documentation Swagger** (`@ApiProperty` complet)

## Standards de Commit
- **Messages**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **Langue**: Français pour les messages et commentaires
- **Structure**: Description claire de ce qui a été fait

## Vérifications Finales
- [ ] Code respecte les conventions de nommage
- [ ] Pas de console.log en production
- [ ] Documentation Swagger complète
- [ ] Tests passent avec bon coverage
- [ ] TypeScript compile sans erreurs
- [ ] ESLint et Prettier appliqués

## Commandes de Validation Rapide
```bash
# Tout en une fois
yarn typecheck && yarn lint && yarn test
```