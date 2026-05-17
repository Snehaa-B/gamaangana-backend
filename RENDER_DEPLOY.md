# Deploy on Render

## Dashboard settings

| Field | Value |
|-------|--------|
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

## Environment variables (required)

Render → your service → **Environment** → add each variable.

### Database (Supabase)

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Pooler URL (port **6543**, `?pgbouncer=true`) |
| `DIRECT_URL` | Direct URL (port **5432**) |

### Firebase (required — app will not start without these)

**Do not** set `FIREBASE_SERVICE_ACCOUNT_PATH` on Render. The JSON file is not in GitHub.

**Option A — three variables (recommended)**

| Key | Value |
|-----|--------|
| `FIREBASE_PROJECT_ID` | e.g. `gamaangna` |
| `FIREBASE_CLIENT_EMAIL` | From Firebase → Service accounts, e.g. `firebase-adminsdk-...@gamaangna.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Full private key from the JSON file |

For `FIREBASE_PRIVATE_KEY` on Render, paste the entire key including:

```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

Keep line breaks as real newlines, or use `\n` between lines in one line.

**Option B — one JSON variable**

| Key | Value |
|-----|--------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Paste the **entire** contents of `firebase-service-account.json` as one line |

### Admin + app

| Key | Value |
|-----|--------|
| `ADMIN_EMAIL` | `admin@gamaangana.com` |
| `ADMIN_PASSWORD` | Your secure password |
| `ADMIN_API_TOKEN` | Long random secret string |
| `NODE_ENV` | `production` |

### Checklist

- [ ] `DATABASE_URL` and `DIRECT_URL` set  
- [ ] Firebase: **either** Option A (3 vars) **or** Option B (JSON var)  
- [ ] **Remove** `FIREBASE_SERVICE_ACCOUNT_PATH` if you added it  
- [ ] Save → **Manual Deploy**

Logs should **not** show `injected env (0)` for critical vars — add them in the Render UI, not a `.env` file in the repo.

## After deploy

```text
https://YOUR-SERVICE.onrender.com/
```

Expected:

```json
{"success":true,"message":"Grama Angana API Running"}
```
