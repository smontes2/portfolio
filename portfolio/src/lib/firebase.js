import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getEnvValue = (key) => {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^['"]|['"]$/g, "");
};

const normalizeStorageBucket = (value = "") => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("gs://")) {
    return trimmed.slice(5).split("/")[0];
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsedUrl = new URL(trimmed);
      const firebaseApiMatch = parsedUrl.pathname.match(/\/v0\/b\/([^/]+)/i);

      if (firebaseApiMatch?.[1]) {
        return firebaseApiMatch[1];
      }

      if (parsedUrl.hostname === "storage.googleapis.com") {
        return parsedUrl.pathname.replace(/^\/+/, "").split("/")[0] || "";
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed.split("/")[0];
};

const firebaseConfig = {
  apiKey: getEnvValue("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvValue("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: normalizeStorageBucket(
    getEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
  ),
  messagingSenderId: getEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvValue("VITE_FIREBASE_APP_ID"),
};

export const hasFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every(Boolean);
export const hasFirebaseStorageConfig = Boolean(firebaseConfig.storageBucket);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  if (hasFirebaseStorageConfig) {
    storage = getStorage(app);
  }
}

export { app, db, auth, storage };
