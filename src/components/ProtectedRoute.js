// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Jika tidak login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;