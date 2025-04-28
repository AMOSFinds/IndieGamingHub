import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBRPWzq2aXXHVGnQpHntPv_ROgV25PEpIg",
  authDomain: "my-gaming-platform.firebaseapp.com",
  projectId: "my-gaming-platform",
  storageBucket: "my-gaming-platform.appspot.com",
  messagingSenderId: "1082915758627",
  appId: "1:1082915758627:web:0bfbd83a8fb4767cd4c796",
  measurementId: "G-8QVNVSF0N2",
};

const app = initializeApp(firebaseConfig);

// ── App Check ─────────────────────────────────────────────────────────────
// During development, you can enable debug mode so that your local
// calls still pass even if App Check enforcement is on.
if (process.env.NODE_ENV !== "production") {
  /* global window */
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Initialize App Check with reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeRoiUrAAAAANRPYD8AfN5f8JxPCM-1HHVDOQH9"),
  isTokenAutoRefreshEnabled: true, // keeps token fresh
});
// ── End App Check ─────────────────────────────────────────────────────────

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export { auth, db, serverTimestamp, analytics, functions, storage, app };
