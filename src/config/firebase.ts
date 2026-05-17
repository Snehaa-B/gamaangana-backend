import admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";
import "./env";

const BACKEND_ROOT = path.resolve(__dirname, "../..");

function loadServiceAccountFromEnv(): admin.ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

/** Entire service-account JSON pasted as one env var (works well on Render). */
function loadServiceAccountFromJsonEnv(): admin.ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    const projectId = parsed.project_id ?? parsed.projectId;
    const clientEmail = parsed.client_email ?? parsed.clientEmail;
    const privateKey = (parsed.private_key ?? parsed.privateKey)?.replace(
      /\\n/g,
      "\n"
    );

    if (!projectId || !clientEmail || !privateKey) {
      return null;
    }

    return { projectId, clientEmail, privateKey };
  } catch {
    console.error("[Firebase] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    return null;
  }
}

function resolveServiceAccountPath(): string {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (fromEnv) {
    return path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(BACKEND_ROOT, fromEnv);
  }
  return path.resolve(BACKEND_ROOT, "src/config/firebase-service-account.json");
}

function loadServiceAccountFromFile(filePath: string): admin.ServiceAccount {
  if (!fs.existsSync(filePath)) {
    const missing: string[] = [];
    if (!process.env.FIREBASE_PROJECT_ID) missing.push("FIREBASE_PROJECT_ID");
    if (!process.env.FIREBASE_CLIENT_EMAIL) missing.push("FIREBASE_CLIENT_EMAIL");
    if (!process.env.FIREBASE_PRIVATE_KEY) missing.push("FIREBASE_PRIVATE_KEY");

    console.error(
      "\n[Firebase] ERROR: No credentials found.\n" +
        (missing.length
          ? `Missing on Render → Environment: ${missing.join(", ")}\n`
          : "") +
        "\nOption A — set these three variables:\n" +
        "  FIREBASE_PROJECT_ID\n" +
        "  FIREBASE_CLIENT_EMAIL\n" +
        "  FIREBASE_PRIVATE_KEY  (full key; use \\n for line breaks)\n" +
        "\nOption B — paste the whole JSON file as:\n" +
        "  FIREBASE_SERVICE_ACCOUNT_JSON\n" +
        "\nDo NOT use FIREBASE_SERVICE_ACCOUNT_PATH on Render (the file is not in git).\n" +
        "See RENDER_DEPLOY.md\n"
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as admin.ServiceAccount;
}

function getServiceAccount(): admin.ServiceAccount {
  return (
    loadServiceAccountFromEnv() ??
    loadServiceAccountFromJsonEnv() ??
    loadServiceAccountFromFile(resolveServiceAccountPath())
  );
}

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId:
      process.env.FIREBASE_PROJECT_ID ??
      serviceAccount.projectId ??
      (serviceAccount as { project_id?: string }).project_id,
  });
}

export default admin;
