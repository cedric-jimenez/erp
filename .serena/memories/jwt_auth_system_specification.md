# Spécification Système d'Authentification JWT - ERP

## Résumé des Exigences
- **Utilisateurs**: Employés uniquement (20 simultanés max)
- **Rôles**: Admin + Operator (système simple A)
- **Authentification**: JWT + cookies HttpOnly
- **Email**: Nodemailer pour mots de passe temporaires
- **Architecture**: Module Auth intégré (Option 1)
- **Conformité**: RGPD (logging minimal, chiffrement bcrypt)

## Architecture Technique

### Structure Module Auth
```
backend/src/modules/auth/
├── auth.module.ts           # Module principal avec JWT setup
├── auth.controller.ts       # /login, /logout, /me, /users (CRUD)
├── auth.service.ts          # Logic login/validation
├── users.service.ts         # CRUD utilisateurs + email
├── guards/
│   ├── jwt-auth.guard.ts    # Protège les routes
│   └── roles.guard.ts       # Contrôle les permissions
├── strategies/
│   └── jwt.strategy.ts      # Validation des tokens
├── decorators/
│   ├── current-user.decorator.ts  # @CurrentUser()
│   └── roles.decorator.ts         # @Roles('admin')
├── dto/
│   ├── login.dto.ts
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
└── entities/
    └── user.entity.ts       # Modèle utilisateur
```

### Base de Données
```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  password          String   // bcrypt hashed
  role              Role     @default(OPERATOR)
  isActive          Boolean  @default(true)
  mustChangePassword Boolean @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLoginAt       DateTime?
}

enum Role {
  ADMIN
  OPERATOR
}
```

### Configuration JWT
- **Durée**: 8h (journée de travail)
- **Stockage**: Cookies HttpOnly + Secure
- **Secret**: Variable d'environnement
- **Refresh**: Automatique transparent

### Permissions par Module
- **Items**: Admin (CRUD complet) + Operator (lecture/création/modification)
- **Stock**: Admin (CRUD complet) + Operator (lecture/mouvements)
- **Vouchers**: Admin (CRUD complet) + Operator (lecture/création)
- **Users**: Admin uniquement

### Email Configuration
- **Service**: Nodemailer + SMTP
- **Template**: Mot de passe temporaire simple
- **Variables ENV**: SMTP_HOST, SMTP_USER, SMTP_PASS

### Compte Admin par Défaut
- **Email**: admin@company.local
- **Password**: TempAdmin123! (à changer au premier login)
- **Creation**: Automatique au démarrage si inexistant

## Plan d'Implémentation

### Phase 1: Base de Données & Entités
1. Migration Prisma pour User model
2. Seed pour compte admin par défaut

### Phase 2: Auth Core
1. JWT Strategy + Guards
2. Auth Service (login/validation)
3. Decorators (@CurrentUser, @Roles)

### Phase 3: API Endpoints
1. POST /auth/login
2. POST /auth/logout  
3. GET /auth/me
4. CRUD /auth/users (admin seulement)

### Phase 4: Email Service
1. Configuration Nodemailer
2. Service envoi mot de passe temporaire
3. Template email

### Phase 5: Protection Routes Existantes
1. Application des guards sur modules items/quotes
2. Tests de permissions

### Phase 6: Tests & Documentation
1. Tests unitaires + e2e
2. Documentation Swagger
3. Validation RGPD

## Dépendances NPM Nécessaires
```json
{
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0", 
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.0",
  "bcrypt": "^5.1.0",
  "nodemailer": "^6.9.0",
  "@types/bcrypt": "^5.0.0",
  "@types/nodemailer": "^6.4.0",
  "@types/passport-jwt": "^3.0.0"
}
```

## Variables d'Environnement
```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=8h

# Email Configuration  
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-app-password
EMAIL_FROM=ERP System <noreply@company.com>

# Default Admin
DEFAULT_ADMIN_EMAIL=admin@company.local
DEFAULT_ADMIN_PASSWORD=TempAdmin123!
```