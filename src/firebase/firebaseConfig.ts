import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGE_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

// Validate without duplicating the object
for (const [key, value] of Object.entries({
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGE_SENDER_ID,
  VITE_FIREBASE_APP_ID,
})) {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const app = initializeApp({
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
});

export const firebaseAuth = getAuth(app);
export default app;
