# Conventions de Code et Style

## Style de Code (Prettier)
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

## Conventions de Nommage
- **Classes**: PascalCase (`ItemsController`, `ItemsService`, `CreateItemDto`)
- **Fichiers**: kebab-case (`items.controller.ts`, `create-item.dto.ts`)
- **DTOs**: Suffixe `Dto` (`CreateItemDto`, `UpdateItemDto`, `QueryItemsDto`)
- **Entités**: Suffixe `Entity` (`Item` pour l'entité)
- **Tests**: Suffixe `.spec.ts` (unit) ou `.e2e-spec.ts` (e2e)

## Structure des Modules NestJS
```
modules/[module-name]/
├── dto/                # Data Transfer Objects
├── entities/          # Entités TypeScript/Prisma
├── test/              # Tests helpers + factories
├── [module].controller.ts
├── [module].service.ts
├── [module].module.ts
├── [module].controller.spec.ts
├── [module].service.spec.ts
├── [module].module.spec.ts
└── [module].e2e-spec.ts
```

## Validation et Transformation
- **Décorateurs**: `@IsString()`, `@IsNotEmpty()`, `@MaxLength()`, etc.
- **Transformation**: `@Transform()` pour nettoyer les données (trim, defaults)
- **Documentation**: `@ApiProperty()` pour Swagger sur chaque propriété

## Patterns TypeScript
- Types explicites sur les propriétés importantes
- Interfaces pour les structures de données
- Classes pour les DTOs avec validation
- Commentaires JSDoc français pour la documentation

## Tests
- **Factories**: Helpers pour créer des données de test (`item.factory.ts`)
- **Test Helpers**: Utilitaires réutilisables (`test-helpers.ts`)
- **Structure**: Tests unitaires + e2e + tests de validation des DTOs