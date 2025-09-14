# Test Architecture Patterns in ERP Backend

## Extended vs Standard Test Pattern

### Purpose & Organization
This NestJS project uses a sophisticated test architecture that separates concerns:

- **Standard Tests** (`*-validation.spec.ts`): Core validation logic
- **Extended Tests** (`*-extended.spec.ts`): Advanced transformations and edge cases

### Examples Found in Codebase

#### DTOs (Data Transfer Objects)
```
src/modules/quotes/dto/
├── dto-validation.spec.ts           # Standard: class-validator rules
├── create-quote-extended.spec.ts    # Extended: class-transformer logic
├── query-quotes-extended.spec.ts    # Extended: pagination transforms
└── quote-line-extended.spec.ts      # Extended: line item transforms
```

#### Entities  
```
src/modules/quotes/entities/
├── entities.spec.ts                 # Standard: basic entity structure
└── quote-entity-extended.spec.ts    # Extended: complex field handling
```

### Technical Focus Areas

#### Standard Tests Focus On:
- Required field validation (`@IsNotEmpty`, `@IsString`)
- Format validation (`@IsEmail`, `@IsDateString`) 
- Business rule validation (custom validators)
- Error message verification

#### Extended Tests Focus On:
- Type transformations (`@Transform`, `@Type`)
- String to number conversions
- Date parsing and normalization  
- Complex object nesting
- Edge case handling (null, undefined, empty strings)

### Benefits of This Pattern

1. **Separation of Concerns**: Clear distinction between validation and transformation
2. **Debugging Efficiency**: Easier to isolate issues to specific functionality
3. **Test Performance**: Faster execution by avoiding heavy validation in transformation tests
4. **Documentation**: Self-documenting code structure for complex business logic
5. **Maintainability**: Changes to validation rules don't affect transformation tests

### Real-World Example
```typescript
// Standard test: Validation
it('should validate required customerName', async () => {
  const dto = plainToClass(CreateQuoteDto, { customerName: '' });
  const errors = await validate(dto);
  expect(errors.find(e => e.property === 'customerName')).toBeDefined();
});

// Extended test: Transformation  
it('should transform customerId from string to number', () => {
  const dto = plainToClass(CreateQuoteDto, { customerId: '123' });
  expect(dto.customerId).toBe(123); // string → number
  expect(typeof dto.customerId).toBe('number');
});
```

### Key Insight for ERP Context
This pattern is particularly valuable in ERP systems where:
- Data comes from various sources (API, CSV imports, manual entry)
- Type safety is critical for financial calculations
- Validation rules are complex and business-specific
- Data transformations must be reliable and testable

### Implementation Recommendation
Continue using this pattern for new modules (stock, vouchers, etc.) to maintain consistency and leverage the architectural benefits already established.