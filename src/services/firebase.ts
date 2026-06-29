import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Firebase Applet configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyDL5ywYP9r9lu_EVsP3qTxOfsS36evXSyM",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "ankdrishti-a95b0.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "ankdrishti-a95b0",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "ankdrishti-a95b0.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "227574876207",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:227574876207:web:7bdd3f374c376e8165deda",
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || "G-68TBXNLH14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore
export const auth = getAuth(app);
const customDbId = (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || "ai-studio-ankdrishti-411cce9d-ce36-43a2-a344-6ecfbd7f5a9e";
export const db = getFirestore(app, customDbId);

// Authentication providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot to satisfy the guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client is offline. Firestore will operate in cache/offline mode.");
    } else {
      console.log("Firebase connection response (expected test):", error);
    }
  }
}
testConnection();
