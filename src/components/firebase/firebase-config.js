import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export { auth, db, serverTimestamp, analytics };
