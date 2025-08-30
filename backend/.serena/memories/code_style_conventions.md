# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Full TypeScript strict mode enabled
- **Target**: ES2022 with CommonJS modules
- **Path Mapping**: Absolute imports with tsconfig paths
- **Decorators**: Experimental decorators enabled for NestJS

## ESLint Configuration
- **Base**: @eslint/js recommended + TypeScript ESLint recommended
- **Type-Aware Rules**: Full type checking enabled
- **Test Files**: Relaxed rules for spec files (no-unsafe-* disabled)
- **Auto-Fix**: Enabled for most rules

## Prettier Configuration
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

## Naming Conventions

### Files & Directories
- **Modules**: kebab-case (`items.service.ts`, `items.controller.ts`)
- **Classes**: PascalCase files (`ItemsService`, `CreateItemDto`)
- **Tests**: `*.spec.ts` for unit tests, `*.e2e-spec.ts` for E2E tests
- **Directories**: kebab-case (`src/modules/items/`)

### Code Naming
- **Classes**: PascalCase (`ItemsService`, `CreateItemDto`)
- **Methods**: camelCase (`findAll`, `checkCodeExists`)
- **Variables**: camelCase (`testItems`, `mockPrisma`)  
- **Constants**: UPPER_SNAKE_CASE (`DATABASE_URL`)

### NestJS Specific
- **Controllers**: `*.controller.ts` suffix
- **Services**: `*.service.ts` suffix  
- **DTOs**: `*.dto.ts` suffix with `Dto` class suffix
- **Entities**: `*.entity.ts` suffix with `Entity` class suffix
- **Modules**: `*.module.ts` suffix

## API Conventions

### Endpoints
- **Versioning**: `/api/v1/` prefix (planned)
- **Resources**: Plural nouns (`/items`, `/vouchers`)
- **Actions**: RESTful verbs (GET, POST, PUT, DELETE)

### Response Format
```typescript
// Paginated responses
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean
  }
}

// Error responses
{
  message: string | string[],
  error: string,
  statusCode: number
}
```

## Validation Patterns
- **DTOs**: class-validator decorators (`@IsString`, `@IsNotEmpty`)
- **Transformations**: class-transformer (`@Transform`) for data cleanup
- **API Documentation**: Swagger decorators (`@ApiProperty`)
- **Input Sanitization**: Trim strings, default values

## Testing Conventions
- **Unit Tests**: Mock all external dependencies
- **E2E Tests**: Use supertest with typed interfaces
- **Factories**: Data generation with ItemFactory patterns
- **Helpers**: Reusable test utilities in `test/` directories
- **Coverage**: Aim for >90% business logic coverage

## Error Handling
- **HTTP Exceptions**: NestJS built-in exceptions
- **Validation Errors**: Automatic class-validator integration  
- **Business Logic**: Custom exceptions with appropriate status codes
- **Logging**: Structured logging (planned)

## Documentation Standards
- **Swagger**: Complete API documentation with examples
- **Code Comments**: Minimal, focus on why not what
- **README**: Comprehensive setup and usage instructions
- **JSDoc**: For public APIs and complex business logic