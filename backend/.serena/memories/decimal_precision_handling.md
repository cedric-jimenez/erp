# Prisma Decimal Type Handling in ERP System

## Why Decimal Instead of Number

### JavaScript Precision Problems
```javascript
// ❌ Problematic with regular numbers
0.1 + 0.2 === 0.3          // false! (0.30000000000000004)
33.33 * 3                  // 99.99000000000001 (not 99.99)

// ✅ Solved with Prisma.Decimal
new Prisma.Decimal('33.33').mul(3)  // Exactly 99.99
```

### ERP Financial Requirements
- **Accounting Standards**: Require cent-precise calculations
- **Legal Compliance**: Rounding errors can cause audit issues  
- **Business Trust**: Financial accuracy is non-negotiable
- **Tax Calculations**: Must be reproducible exactly

## Implementation in Codebase

### Database Schema (Prisma)
```prisma
model Quote {
  totalAmount  Decimal
  taxAmount    Decimal  
  totalWithTax Decimal
}

model QuoteLine {
  unitPrice  Decimal
  lineTotal  Decimal
  quantity   Decimal
}
```

### Test Corrections Applied
```typescript
// ❌ Before: Direct comparison fails
expect(quote.totalAmount).toBe(100.0);  // Type error

// ✅ After: Convert for comparison  
expect(Number(quote.totalAmount)).toBe(100.0);  // Works correctly
```

### Mock Data Handling
```typescript
// ❌ Before: ESLint unsafe constructor
totalAmount: new Prisma.Decimal(data.totalAmount),

// ✅ After: Type-safe constructor
totalAmount: new Prisma.Decimal(data.totalAmount as number),
```

## Best Practices Established

### 1. Test Comparisons
```typescript
// For test assertions, convert Decimal to number
expect(result.totalAmount.toNumber()).toBe(expectedAmount);
expect(Number(quote.totalAmount)).toBe(100.0);
```

### 2. Mock Data Creation
```typescript
// Always type-cast when creating Decimals from dynamic data
totalAmount: new Prisma.Decimal(amount as number),
taxAmount: new Prisma.Decimal(tax as number),
```

### 3. Business Logic
```typescript
// Use Decimal methods for calculations
const total = unitPrice.mul(quantity);
const taxAmount = subtotal.mul(taxRate);
const grandTotal = subtotal.add(taxAmount);
```

## Files Corrected for Decimal Handling
- `src/modules/quotes/test/test-helpers.ts`: Mock data creation
- `src/modules/quotes/entities/quote-entity-extended.spec.ts`: Test assertions
- `src/modules/quotes/quotes.service.spec.ts`: Service test comparisons

## Impact on Future Development
- **Stock Module**: Will need Decimal for inventory values, costs
- **Vouchers Module**: Critical for financial transaction amounts
- **Reporting**: All financial reports must maintain precision
- **API Responses**: Consider serialization strategy (number vs string)

This approach ensures the ERP system maintains financial integrity required for professional business applications.