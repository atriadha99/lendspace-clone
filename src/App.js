// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CatalogPage from './pages/CatalogPage'; // Import Catalog
import ProfilePage from './pages/ProfilePage'; // Import Profile
// ... import lainnya ...
import WithdrawPage from './pages/WithdrawPage'; // 1. Import Withdraw
import PaymentSuccessPage from './pages/PaymentSuccessPage'; // 2. Import Success
import ProductDetailPage from './pages/ProductDetailPage';
import WithdrawPage from './pages/WithdrawPage'; 

function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="container.xl" pt="80px" pb="10">
        <Routes>
          {/* ... route yang sudah ada ... */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* 3. TAMBAHKAN ROUTE INI */}
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          
        </Routes>
      </Container>
    </Box>
  );
}

export default App;