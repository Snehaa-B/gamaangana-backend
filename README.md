# Backend — Grama-Angana API

Node.js + TypeScript + Express + Prisma + Supabase PostgreSQL + Firebase Auth

## Prerequisites

- Node.js 18 or higher
- A Supabase project with PostgreSQL connection strings
- A Firebase project with Email/Password authentication enabled

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy `.env` and fill in your Supabase connection strings:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres"
```

### 3. Add Firebase service account

Read `FIREBASE_SETUP.md` carefully and place the downloaded JSON at:

```
src/config/firebase-service-account.json
```

This file is in `.gitignore` and must never be committed.

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start development server

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

## Folder Structure

```
backend/
  prisma/
    schema.prisma         Database schema (User, Hall, Booking, Event, MaintenanceItem)
    migrations/           Auto-generated migration SQL files
  src/
    config/
      prisma.ts           Shared PrismaClient singleton
      firebase.ts         Firebase Admin SDK initialization
    middleware/
      authMiddleware.ts   Verifies Firebase ID tokens on protected routes
    types/
      index.ts            AuthRequest type extending Express Request
    services/             Prisma query functions (one file per model)
    controllers/          HTTP handlers that call services
    routes/               Express Router definitions
    app.ts                Express app setup and route wiring
    server.ts             Server startup on port 3000
  .env                    Secret environment variables (not committed)
  .gitignore
  package.json
  tsconfig.json
```

## Database Models

| Model | Description |
|---|---|
| User | App user linked to Firebase account by email |
| Hall | Community hall with name, location, capacity |
| Booking | Hall reservation request (PENDING / APPROVED / REJECTED) |
| Event | Auto-created when booking is approved |
| MaintenanceItem | Fund collection item with progress tracking |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with hot reload via ts-node-dev |
| `npx prisma migrate dev` | Create a new migration |
| `npx prisma studio` | Open visual DB browser |
| `npx prisma format` | Auto-format schema.prisma |

## API Reference

See `API.md` for all endpoints.
