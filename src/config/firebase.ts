import admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";
import "./env";

const BACKEND_ROOT = path.resolve(__dirname, "../..");

function resolveServiceAccountPath(): string {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (fromEnv) {
    return path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(BACKEND_ROOT, fromEnv);
  }
  return path.resolve(__dirname, "firebase-service-account.json");
}

function loadServiceAccountFromFile(filePath: string): admin.ServiceAccount {
  if (!fs.existsSync(filePath)) {
    console.error(
      "\n[Firebase] ERROR: Service account file not found.\n" +
        `Expected path: ${filePath}\n` +
        "Set FIREBASE_SERVICE_ACCOUNT_PATH in .env or place the JSON at\n" +
        "src/config/firebase-service-account.json\n" +
        "See backend/FIREBASE_SETUP.md\n"
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as admin.ServiceAccount;
}

function loadServiceAccountFromEnv(): admin.ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getServiceAccount(): admin.ServiceAccount {
  const fromEnv = loadServiceAccountFromEnv();
  if (fromEnv) {
    return fromEnv;
  }
  return loadServiceAccountFromFile(resolveServiceAccountPath());
}

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId:
      process.env.FIREBASE_PROJECT_ID ??
      (serviceAccount as { project_id?: string }).project_id ??
      serviceAccount.projectId,
  });
}

export default admin;
