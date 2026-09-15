import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

// NOTE: create-react-app inlines these at build time, so they end up in the
// public bundle. This is about being able to swap Firebase projects without
// editing source — not about secrecy. A Firebase web apiKey is public by
// design; database.rules.json is what actually protects the data.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(
  firebaseConfig.databaseURL && firebaseConfig.apiKey,
);

// Only initialise when configured: getDatabase() on an undefined databaseURL
// throws at module load, which would white-screen the whole app including the
// REST-backed tables that have nothing to do with Firebase.
const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;

if (!firebaseEnabled) {
  console.warn(
    "Firebase is not configured — the realtime panel is disabled. Set REACT_APP_FIREBASE_* in .env",
  );
}

// Shared sign-in promise every RTDB caller awaits. Never rejects: callers check
// whether they got a user back.
export const authReady = firebaseEnabled
  ? signInAnonymously(getAuth(app))
      .then((cred) => cred.user)
      .catch((e) => {
        console.error("Firebase anonymous sign-in failed:", e.message);
        return null;
      })
  : Promise.resolve(null);

export default app;
