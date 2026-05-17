# Firebase Admin SDK Setup

The backend uses Firebase Admin SDK to verify ID tokens sent by the Android app.

## Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Project name: `grama-angana`
4. Disable Google Analytics (optional for development)
5. Click "Create project"

## Step 2 — Enable Email/Password Authentication

1. In your Firebase project, go to: Build > Authentication
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable" to ON
5. Click "Save"

## Step 3 — Generate Service Account Key

1. In your Firebase project, go to: Project Settings (gear icon)
2. Click the "Service accounts" tab
3. Click "Generate new private key"
4. Click "Generate key" in the confirmation dialog
5. A JSON file will download to your computer

## Step 4 — Place the File

Move the downloaded JSON file to:

```
backend/src/config/firebase-service-account.json
```

Add to `backend/.env` (see `.env.example`):

```
FIREBASE_PROJECT_ID=gamaangna
FIREBASE_SERVICE_ACCOUNT_PATH=src/config/firebase-service-account.json
```

Restart the server after changing `.env`.

The file looks like this:

```json
{
  "type": "service_account",
  "project_id": "grama-angana-xxxxx",
  "private_key_id": "...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxx@grama-angana.iam.gserviceaccount.com",
  ...
}
```

## Step 5 — Verify gitignore

Make sure this line is in `backend/.gitignore`:

```
src/config/firebase-service-account.json
```

It is already there. Never remove it. This file contains a private key.

## Step 6 — Test It

Start the server:

```bash
npm run dev
```

If the file is missing or invalid, you will see a clear error message in the console.

## Step 7 — Add Android App to Firebase

1. In Firebase console, click the Android icon to add an Android app
2. Package name: `com.gamaangana`
3. Download `google-services.json`
4. Place it at: `android/app/google-services.json`

## How It Works

```
Android app logs in with Firebase
        |
        | Firebase returns ID Token (JWT)
        v
Android sends: Authorization: Bearer <token>
        |
        v
Backend: admin.auth().verifyIdToken(token)
        |
        | If valid: attaches decoded user to req.user
        | If invalid: returns 401 Unauthorized
        v
Controller receives req.user.email
        |
        v
Prisma looks up user in PostgreSQL by email
```
