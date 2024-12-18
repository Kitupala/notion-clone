// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-clone-5967d.firebaseapp.com",
  projectId: "notion-clone-5967d",
  storageBucket: "notion-clone-5967d.firebasestorage.app",
  messagingSenderId: "1083264310866",
  appId: "1:1083264310866:web:cbb5ce252dc5e45eaa898b",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
