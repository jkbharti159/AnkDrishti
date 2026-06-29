import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { auth, db, googleProvider } from "../services/firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync / create profile in firestore
  const syncProfile = async (firebaseUser: FirebaseUser, isNewUser = false, customFullName?: string) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const nowStr = new Date().toISOString();

      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: customFullName || firebaseUser.displayName || "Cosmic Seeker",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
          provider: firebaseUser.providerData[0]?.providerId || "password",
          createdAt: nowStr,
          lastLogin: nowStr,
          emailVerified: firebaseUser.emailVerified,
          subscription: "free",
          role: "user"
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } else {
        const existingData = userDoc.data() as UserProfile;
        const updatedProfile = {
          ...existingData,
          lastLogin: nowStr,
          emailVerified: firebaseUser.emailVerified,
        };
        // Update if there are any differences
        if (existingData.lastLogin !== nowStr || existingData.emailVerified !== firebaseUser.emailVerified) {
          await updateDoc(userRef, {
            lastLogin: nowStr,
            emailVerified: firebaseUser.emailVerified
          });
        }
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error("Error syncing user profile with Firestore:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await syncProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update full name in Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: fullName
      });

      // Send initial verification email
      await sendEmailVerification(firebaseUser);

      // Create profile document in Firestore
      await syncProfile(firebaseUser, true, fullName);
      setUser(firebaseUser);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await syncProfile(firebaseUser);
      setUser(firebaseUser);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
      await syncProfile(firebaseUser);
      setUser(firebaseUser);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No active user session to send verification email to.");
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const reloadedUser = auth.currentUser;
      setUser(reloadedUser);
      if (reloadedUser) {
        await syncProfile(reloadedUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        sendVerification,
        sendPasswordReset,
        logout,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
