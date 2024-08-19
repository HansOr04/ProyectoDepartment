import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserByID } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("onAuthStateChanged triggered", firebaseUser);
      setLoading(true);
      if (firebaseUser) {
        try {
          const userData = await getUserByID(firebaseUser.uid);
          console.log("User data fetched:", userData);
          setUser(userData);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data");
        }
      } else {
        console.log("No user found, setting user to null");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    console.log("Login function called");
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserByID(userCredential.user.uid);
      console.log("Login successful, user data:", userData);
      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("Current auth state:", { user, loading, error });

  const value = {
    user,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};