import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// const serviceKey = require("@/service_key.json");

const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");

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
