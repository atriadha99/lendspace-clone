// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Import ChakraProvider
import { ChakraProvider } from '@chakra-ui/react';

// 2. Import AuthProvider (ini tetap diperlukan)
import { AuthProvider } from './context/AuthContext';

// 3. HAPUS 'import ./index.css' DARI SINI
// 4. HAPUS 'import ./global-overrides.css' (Kita akan pindahkan)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 5. Bungkus SEMUANYA dengan ChakraProvider */}
    <ChakraProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);