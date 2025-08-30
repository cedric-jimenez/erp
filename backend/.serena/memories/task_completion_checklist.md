# Task Completion Checklist

## Before Starting Development
- [ ] Check git status: `git status && git branch`
- [ ] Ensure on feature branch, not main/master
- [ ] Pull latest changes: `git pull origin main`
- [ ] Install dependencies: `yarn install`

## During Development
- [ ] Follow established code patterns and conventions
- [ ] Add validation to DTOs with class-validator decorators
- [ ] Update Swagger documentation with @ApiProperty
- [ ] Write unit tests for new business logic
- [ ] Add E2E tests for new API endpoints

## Code Quality Checks (MANDATORY)
```bash
# 1. Lint check - MUST pass with 0 errors
yarn lint

# 2. Format check - auto-fixes formatting
yarn format  

# 3. Type check - implicit in build
yarn build

# 4. Test suite - MUST pass 100%
yarn test

# 5. Coverage check - review new code coverage
yarn test:cov
```

## Before Committing
- [ ] Run full test suite: `yarn test`
- [ ] Check lint status: `yarn lint` (0 errors required)
- [ ] Build successfully: `yarn build`
- [ ] Review changes: `git diff`
- [ ] Commit with conventional format: `feat:`, `fix:`, `docs:`, `refactor:`

## API Development Specific
- [ ] Add Swagger documentation to all endpoints
- [ ] Implement input validation with appropriate DTOs
- [ ] Add comprehensive error handling
- [ ] Test all success and error scenarios
- [ ] Update API documentation if endpoints change

## Database Changes (When Implemented)
- [ ] Update Prisma schema if needed
- [ ] Generate new Prisma client: `npx prisma generate`
- [ ] Create and test migrations: `npx prisma migrate dev`
- [ ] Update seed data if necessary

## Testing Requirements
- [ ] Unit tests for all service methods
- [ ] E2E tests for all controller endpoints  
- [ ] Test both success and error scenarios
- [ ] Maintain >90% code coverage for business logic
- [ ] All tests pass: 71/71 ✅

## Documentation Updates
- [ ] Update README.md if commands change
- [ ] Update API documentation in Swagger
- [ ] Add inline comments for complex business logic
- [ ] Update CLAUDE.md if project structure changes

## Quality Gates (All Must Pass)
1. **ESLint**: 0 errors, 0 warnings
2. **Build**: Successful compilation
3. **Tests**: 100% pass rate (currently 71/71)
4. **Type Safety**: No TypeScript errors
5. **Format**: Prettier compliance

## Pre-Production Checklist (Future)
- [ ] Security audit of new endpoints
- [ ] Performance testing if applicable
- [ ] Database migration tested
- [ ] Environment variables documented
- [ ] Error monitoring configured