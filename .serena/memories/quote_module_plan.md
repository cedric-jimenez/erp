# Plan Module Quotes - Spécifications Complètes

## Contexte & Decisions
- **Scope**: Backend uniquement (pas de frontend)
- **Terminologie**: Anglais (Quote au lieu de Devis)
- **Exclusions**: Pas de PDF, pas de CRM complexe
- **Approche**: Simple et pragmatique (Option A)

## Structure de Données Définitive

### Quote Entity
```typescript
{
  id, number: "QUO-2024-001", createdAt, validUntil,
  customerId, customerName, customerEmail,
  status: "draft" | "sent" | "accepted" | "rejected" | "expired",
  totalAmount, taxAmount, totalWithTax
}
```

### Quote Lines
```typescript
{
  quoteId, itemId, itemCode, itemName, 
  quantity, unitPrice, lineTotal
}
```

## API Endpoints
```
GET    /api/v1/quotes          # Liste avec filtres
POST   /api/v1/quotes          # Création
GET    /api/v1/quotes/:id      # Détail par ID
PUT    /api/v1/quotes/:id      # Modification (si draft)
PATCH  /api/v1/quotes/:id/send   # Statut → 'sent'
PATCH  /api/v1/quotes/:id/accept # Statut → 'accepted'
DELETE /api/v1/quotes/:id      # Suppression soft
```

## Architecture Module NestJS
```
src/modules/quotes/
├── dto/
│   ├── create-quote.dto.ts
│   ├── update-quote.dto.ts
│   ├── query-quotes.dto.ts
│   └── quote-line.dto.ts
├── entities/
│   ├── quote.entity.ts
│   └── quote-line.entity.ts
├── test/
│   ├── quote.factory.ts
│   └── test-helpers.ts
├── quotes.controller.ts
├── quotes.service.ts
├── quotes.module.ts
└── [fichiers tests]
```

## Business Logic Core
- **Workflows statuts**: draft → sent → accepted/rejected/expired
- **Calculs auto**: Totaux lignes → Total quote + TVA
- **Numérotation**: QUO-YYYY-NNN automatique
- **Validation**: Quantités > 0, items valides, customer requis

## Plan d'Implémentation (9 jours)
1. **Database & Models** (2j): Prisma schema, entities TypeScript
2. **DTOs & Validation** (1j): CreateQuoteDto, validation class-validator
3. **Service Layer** (2j): CRUD + logique métier + transitions statuts
4. **Controller & API** (1j): REST endpoints + Swagger doc
5. **Testing** (2j): Unit tests + E2E + factories
6. **Integration** (1j): Module registration + quality checks

## Standards Qualité
- Architecture alignée sur module Items existant
- Patterns NestJS (Controller/Service/Module)
- Tests complets (unit + e2e + factories)
- Coverage 70-90% comme projet actuel
- Swagger documentation complète