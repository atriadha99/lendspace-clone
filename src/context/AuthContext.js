// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Secara default, pengguna tidak terautentikasi
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Dalam aplikasi nyata, ini akan terjadi setelah verifikasi username/password
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};