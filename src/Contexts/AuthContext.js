import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await fetchUserDoc(user.uid);
          if (userDoc) {
            setCurrentUser({ ...user, ...userDoc });
          } else {
            await signOut(auth);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserDoc = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const addUserDoc = async (data) => {
    const docRef = doc(db, "users", data.uid);
    await setDoc(docRef, data);
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential);

      // Add the user to Firestore
      await addUserDoc({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: "admin", // Set default role or modify as needed
      });

      return userCredential;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in successfully:", userCredential);

      // Check the user's role
      const userDoc = await fetchUserDoc(userCredential.user.uid);
      if (!userDoc || userDoc.role !== "admin") {
        await signOut(auth);
        throw new Error(
          "You do not have the necessary permissions to access this resource."
        );
      }

      setCurrentUser({ ...userCredential.user, ...userDoc });
      return userCredential;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
