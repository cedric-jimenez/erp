# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ERP (Enterprise Resource Planning) project designed for SMEs, focused on managing:
- **Items** (creation, tracking, archiving)
- **Stock** (movements, low stock alerts)  
- **Vouchers** (entry, exit, transfer, delivery vouchers)

The project follows a modular, extensible architecture using modern TypeScript-based technologies.

## Technology Stack

- **Frontend**: Next.js + TypeScript (planned: Shadcn/UI or MUI, Zustand/React Query for state)
- **Backend**: NestJS + TypeScript (planned: Prisma ORM, JWT + RBAC auth)
- **Database**: PostgreSQL (production), SQLite (local development), MySQL/MariaDB (flexible hosting)
- **Containerization**: Docker + Docker Compose

## Project Structure

Based on documentation, the planned structure is:
```
erp/
├── backend/          # NestJS API
│   ├── src/
│   └── Dockerfile
├── frontend/         # Next.js UI
│   ├── app/          # App Router (or pages/ for Pages Router)
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

**Note**: Currently only documentation exists - no actual frontend/backend directories are present yet.

## Development Commands

**IMPORTANT**: Always use `yarn` as the package manager, never `npm`.

**Frontend** (when implemented):
```bash
cd frontend
yarn install
yarn dev
```

**Backend** (when implemented):
```bash
cd backend
yarn install
yarn start:dev
```

**Full Stack with Docker**:
```bash
docker-compose up --build
```

**Expected Services**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001  
- API Documentation: http://localhost:3001/api (Swagger)
- pgAdmin: http://localhost:5050

## Core Modules (MVP)

### 1. Items Management
- Fields: code, name, description, unit, category, stock_min, active
- CRUD operations, movement history, simple archiving

### 2. Stock Management  
- Multi-warehouse support (scalable)
- Calculated inventory from movements
- Low stock alerts

### 3. Vouchers Management
- Types: entry, exit, transfer, delivery vouchers
- Fields: number, date, type, item lines, status, reason
- Status: draft/validated
- Auto-generates stock movements

### 4. Users & Permissions
- Roles: Admin, Operator
- JWT + simplified RBAC

## Naming Conventions

### Frontend (Next.js/React)
- **Components**: PascalCase (`ItemList.tsx`, `VoucherForm.tsx`)
- **Custom hooks**: prefix `use` (`useItemForm.ts`, `useVoucherForm.ts`)
- **Directories**: `app/`, `components/`, `lib/`, `store/`

### Backend (NestJS)
- **Structure**: `src/modules/items/`, `src/modules/vouchers/`, `src/common/`
- **Classes**: PascalCase (`ItemService`, `VoucherService`)
- **Files**: kebab-case (`item.controller.ts`, `voucher.service.ts`)
- **DTOs & Entities**: suffix `Dto` and `Entity`
- **API Endpoints**: kebab-case plural (`/api/v1/items`, `/api/v1/vouchers`)

### Database (Prisma)
- **Tables**: snake_case (`items`, `stock_movements`, `vouchers`, `voucher_lines`)
- **Fields**: snake_case (`created_at`, `stock_min`)
- **Key Relations**:
  - `Item` 1→n `StockMovement`
  - `Voucher` 1→n `VoucherLine`

## UI Guidelines

- Fixed sidebar navigation: Dashboard / Items / Stock / Vouchers
- Filterable, sortable lists with pagination (20+ entries)
- Simple item forms (3-5 main visible fields)
- Multi-line voucher creation forms
- History tables with date/type filters

## Quality Standards

- **Code Style**: ESLint + Prettier enforcement
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)
- **Testing**: Minimum unit tests on NestJS services
- **Security**: JWT sessions, HttpOnly cookies in production, RBAC access control
- **API**: RESTful with versioning (`/api/v1/...`), server-side validation with class-validator

## Current State

This project is in the planning/documentation phase. The codebase currently contains:
- Comprehensive documentation in `doc/` directory
- Screen mockups for the item management UI
- Architectural guidelines and technical specifications
- No actual implementation code yet

When implementing, refer to the detailed guidelines in `doc/guidelines.md` for UX/UI patterns, API design, and security considerations.