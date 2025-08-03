# Directory structure for the ERP project

This document describes the directory structure for the ERP project, which consists of a backend built with NestJS and a frontend built with Next.js.

The project is organized to facilitate development, deployment, and maintenance. Each major component has its own directory, and Docker is used for containerization.


```
erp/
├── backend/          # NestJS (API)
│   ├── src/
│   └── Dockerfile
├── frontend/         # Next.js (UI)
│   ├── app/          # (ou pages/ si tu n'utilises pas app router)
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```