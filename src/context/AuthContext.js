// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const unsubscribe = account.onAuthStateChange((session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const current = await account.get();
      setUser(current);
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password);
    const current = await account.get();
    setUser(current);
  };

  const register = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};