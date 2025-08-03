# ERP - Items & Vouchers Management

![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## 📦 Description

ERP minimaliste destiné aux **PME**, permettant de gérer :

* **Items** (création, suivi, archivage)
* **Stock** (mouvements, alertes de stock bas)
* **Vouchers** (bons d'entrée, sortie, transfert, livraison)

Objectif : offrir une **solution simple, modulaire et extensible** pour gérer des stocks et bons de manière centralisée.

---

## 🛠️ Stack Technique

* **Frontend** : [Next.js](https://nextjs.org/) + TypeScript
  UI : Shadcn/UI ou MUI
  State : Zustand / React Query
* **Backend** : [NestJS](https://nestjs.com/) + TypeScript
  ORM : Prisma
  Auth : JWT + RBAC
* **Base de données** : PostgreSQL (SQLite possible en local)
* **Conteneurisation** : Docker + Docker Compose

---

## 📂 Structure du Projet

```bash
erp/
├── frontend/          # App Next.js
├── backend/           # API NestJS
├── docker-compose.yml
└── README.md
```

* **frontend/** : Interface web (Next.js)
* **backend/** : API REST/GraphQL (NestJS + Prisma)
* **docker-compose.yml** : Orchestration des services (front, back, DB, pgAdmin)

---

## 🚀 Installation & Lancement

### 1️⃣ Prérequis

* [Node.js](https://nodejs.org/) 20+
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 2️⃣ Cloner le projet

```bash
git clone https://github.com/username/erp.git
cd erp
```

### 3️⃣ Lancer avec Docker

```bash
docker-compose up --build
```

Services disponibles :

* Frontend : [http://localhost:3000](http://localhost:3000)
* Backend : [http://localhost:3001](http://localhost:3001)
* pgAdmin : [http://localhost:5050](http://localhost:5050)

---

## ⚙️ Développement

* **Frontend** :

```bash
cd frontend
npm install
npm run dev
```

* **Backend** :

```bash
cd backend
npm install
npm run start:dev
```

---

## 📖 Documentation API

* Swagger : `http://localhost:3001/api`
* Version des endpoints : `/api/v1/...`

---

## ✅ Bonnes pratiques

* Commits conventionnels : `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
* Respect des conventions ESLint + Prettier
* Tests unitaires minimum sur NestJS Services

---

## 📄 License

Projet sous licence **MIT**.
Libre à vous de l'utiliser, le modifier et le distribuer.
