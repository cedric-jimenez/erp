# Essential Development Commands

## Development Workflow
```bash
# Start development server with hot reload
yarn start:dev

# Build the project
yarn build

# Start production server
yarn start:prod

# Debug mode with inspector
yarn start:debug
```

## Code Quality & Testing
```bash
# Run all tests
yarn test

# Run tests in watch mode  
yarn test:watch

# Run tests with coverage report
yarn test:cov

# Run E2E tests
yarn test:e2e

# Run ESLint with auto-fix
yarn lint

# Format code with Prettier
yarn format
```

## Docker Operations
```bash
# Start all services (from project root)
docker-compose up -d

# View service URLs
make urls

# Stop all services
make down
```

## System Commands (Linux)
```bash
# File operations
ls -la                  # List files with permissions
find . -name "*.ts"     # Find TypeScript files
grep -r "pattern" src/  # Search in source files

# Git operations
git status              # Check working tree
git log --oneline       # View commit history
git diff                # View changes

# Process management
ps aux | grep node      # Find Node processes
kill -9 <pid>          # Force kill process
netstat -tulpn | grep 3001  # Check port usage
```

## Package Management
```bash
# Install dependencies
yarn install

# Add new dependency
yarn add <package>

# Add dev dependency  
yarn add -D <package>

# Update dependencies
yarn upgrade

# Check outdated packages
yarn outdated
```

## Database Operations (Planned)
```bash
# Prisma operations (when implemented)
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open Prisma Studio
```

## Key Service URLs
- **API**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api  
- **Health Check**: http://localhost:3001/health
- **pgAdmin**: http://localhost:5050 (admin@example.com / admin123)
- **PostgreSQL**: localhost:5432 (erp_user / erp_password / erp_db)