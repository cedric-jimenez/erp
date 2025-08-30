# ERP Backend Project Overview

## Purpose
Backend NestJS API for an ERP (Enterprise Resource Planning) system designed for SMEs, managing:
- **Items**: Creation, editing, archiving of products/articles
- **Stock**: Stock movements, low stock alerts  
- **Vouchers**: Entry, exit, transfer, delivery vouchers
- **Authentication**: User management and permissions (planned)

## Current Implementation Status
- ✅ Core NestJS setup with TypeScript
- ✅ Items module fully implemented (CRUD operations)
- ✅ Swagger documentation integrated
- ✅ Comprehensive test suite (71 tests, 100% pass rate)
- ✅ ESLint/Prettier configuration optimized
- ✅ Docker integration ready
- ⏳ Prisma ORM integration (planned)
- ⏳ Authentication module (planned)
- ⏳ Stock and Vouchers modules (planned)

## Tech Stack
- **Framework**: NestJS v11 + TypeScript v5.7
- **Database**: PostgreSQL (production), SQLite (development) 
- **ORM**: Prisma v6.14 (configured)
- **Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Validation**: class-validator + class-transformer
- **Testing**: Jest with supertest for E2E
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Architecture Patterns
- **Modular Architecture**: Feature-based modules (items/, auth/, stock/, vouchers/)
- **DDD Approach**: Entities, DTOs, Services, Controllers separation
- **CRUD Pattern**: Standardized service layer with pagination
- **DTO Validation**: Comprehensive input validation with decorators
- **API Versioning**: RESTful APIs with /api/v1/ prefix (planned)

## Key Features Implemented
- Items CRUD with soft delete (archive/restore)
- Pagination with metadata (page, limit, total, etc.)
- Input validation and transformation
- Comprehensive error handling
- Swagger documentation with examples
- Complete test coverage (unit + E2E)