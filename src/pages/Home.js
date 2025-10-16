// src/pages/Home.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LandingPage from './LandingPage';
import LoggedInHomePage from './LoggedInHomePage';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  // Jika sudah login, tampilkan dasbor. Jika belum, tampilkan landing page.
  return isAuthenticated ? <LoggedInHomePage /> : <LandingPage />;
}

export default Home;