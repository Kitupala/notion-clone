import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let serviceKey;

// Check if running in production or development
if (process.env.NODE_ENV === "production") {
  serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;
} else {
  try {
    const serviceKeyPath = path.resolve("./service_key.json");
    serviceKey = JSON.parse(fs.readFileSync(serviceKeyPath, "utf8"));
  } catch (error) {
    console.error("Failed to load service key:", error);
    serviceKey = null;
  }
}

if (!serviceKey) {
  throw new Error("Firebase service account key is not configured");
}

let app;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore();

export { app as adminApp, adminDb };
