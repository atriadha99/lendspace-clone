import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CatalogPage from './pages/CatalogPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import WithdrawPage from './pages/WithdrawPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="container.xl" pt="80px" pb="10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Halaman Transaksi */}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/chat/:receiverId" element={<ChatPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;