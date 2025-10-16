// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
// Ganti useEffect yang lama dengan ini
useEffect(() => {
  // Solusi: Langsung set className, bukan .add()
  // Ini akan menghapus class lama dan menambahkan yang baru jika ada.
  document.body.className = theme === 'light' ? 'light-theme' : '';
  localStorage.setItem('theme', theme);
}, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};