# Codebase Structure and Architecture

## Directory Structure
```
backend/
├── src/
│   ├── app.module.ts              # Root application module
│   ├── app.controller.ts          # Health check endpoints
│   ├── app.service.ts             # Application-level services
│   ├── main.ts                    # Application bootstrap
│   ├── modules/                   # Feature modules
│   │   └── items/                 # Items management module
│   │       ├── items.module.ts    # Items module definition
│   │       ├── items.controller.ts # REST API endpoints
│   │       ├── items.service.ts   # Business logic
│   │       ├── dto/               # Data Transfer Objects
│   │       │   ├── create-item.dto.ts
│   │       │   ├── update-item.dto.ts
│   │       │   └── query-items.dto.ts
│   │       ├── entities/          # Data models
│   │       │   └── item.entity.ts
│   │       └── test/              # Test utilities
│   │           ├── item.factory.ts
│   │           └── test-helpers.ts
│   └── prisma/                    # Database layer
│       ├── prisma.service.ts      # Prisma client service
│       └── prisma.module.ts       # Prisma module
├── test/                          # E2E test configuration
├── prisma/                        # Database schema (planned)
├── coverage/                      # Test coverage reports
└── dist/                          # Compiled output
```

## Module Architecture Pattern

### Items Module (Implemented)
- **Controller** (`items.controller.ts`): REST API endpoints with Swagger docs
- **Service** (`items.service.ts`): Business logic, database operations  
- **DTOs** (`dto/`): Input validation and API contracts
- **Entities** (`entities/`): Data models and transformations
- **Tests** (`*.spec.ts`): Unit and E2E tests with factories

### Planned Modules
- **auth/** - User authentication and authorization (JWT + RBAC)
- **stock/** - Inventory management and movements  
- **vouchers/** - Document management (entry/exit/transfer)

## Key Files and Their Purpose

### Core Application
- `main.ts`: Bootstrap, Swagger setup, validation pipes
- `app.module.ts`: Root module, imports all feature modules
- `app.controller.ts`: Health check and application-level endpoints

### Items Module Components
- **ItemsController**: 
  - GET /items (paginated list with filtering)
  - POST /items (create new item)
  - GET /items/:id (get single item)
  - PUT /items/:id (update item)
  - DELETE /items/:id (soft delete/archive)
  - POST /items/:id/restore (restore archived item)
  - GET /items/check-code/:code (check code uniqueness)

- **ItemsService**:
  - `create()`: Item creation with validation
  - `findAll()`: Paginated queries with filtering
  - `findOne()`: Single item retrieval
  - `update()`: Item modification
  - `remove()`: Soft delete (archive)
  - `restore()`: Unarchive items
  - `checkCodeExists()`: Code uniqueness validation

### Data Layer
- **DTOs**: Input validation with class-validator decorators
- **Entities**: Response transformation and data modeling
- **Factory Pattern**: Test data generation utilities

## Testing Architecture
- **Unit Tests**: Service and controller logic (`.spec.ts`)
- **E2E Tests**: Full HTTP request/response testing (`.e2e-spec.ts`)
- **Test Helpers**: Reusable utilities and mocks
- **Factory Pattern**: Consistent test data generation

## Configuration Files
- `eslint.config.mjs`: ESLint with TypeScript, test-specific overrides
- `tsconfig.json`: TypeScript strict mode, path mapping
- `nest-cli.json`: NestJS CLI configuration
- `package.json`: Dependencies, scripts, Jest configuration
- `.prettierrc`: Code formatting rules

## API Design Patterns
- **RESTful URLs**: Resource-based with HTTP verbs
- **Pagination**: Consistent metadata structure
- **Validation**: Input sanitization and transformation
- **Error Handling**: Structured error responses
- **Documentation**: Swagger with examples and schemas