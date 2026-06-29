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
  apiKey: "AIzaSyDL5ywYP9r9lu_EVsP3qTxOfsS36evXSyM",
  authDomain: "ankdrishti-a95b0.firebaseapp.com",
  projectId: "ankdrishti-a95b0",
  storageBucket: "ankdrishti-a95b0.firebasestorage.app",
  messagingSenderId: "227574876207",
  appId: "1:227574876207:web:7bdd3f374c376e8165deda",
  measurementId: "G-68TBXNLH14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

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
