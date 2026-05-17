# Deploy on Render

## Dashboard settings

| Field | Value |
|-------|--------|
| **Root Directory** | *(empty — if this repo is only the backend)* |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

> **Important:** Use `--include=dev` so TypeScript and `@types/*` install during build.

## Environment variables

Set these in Render → **Environment**:

```
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...supabase.com:5432/postgres

FIREBASE_PROJECT_ID=gamaangna
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@gamaangna.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

ADMIN_EMAIL=admin@gamaangana.com
ADMIN_PASSWORD=your-secure-password
ADMIN_API_TOKEN=long-random-secret

NODE_ENV=production
```

Do **not** use `FIREBASE_SERVICE_ACCOUNT_PATH` on Render — use the three Firebase vars above.

## Node version

This project uses **Node 20** (see `.node-version`). Render will pick it up automatically.

## After deploy

Test: `https://YOUR-SERVICE.onrender.com/`  
Expected: `{"success":true,"message":"Grama Angana API Running"}`
