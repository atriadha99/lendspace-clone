// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react'; // Import layout Chakra

// Import CSS khusus untuk library eksternal
import './global-overrides.css';

// Import Halaman & Komponen
import Navbar from './Navbar';
import Home from './pages/Home';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LendItemPage from './pages/LendItemPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentGatewayPage from './pages/PaymentGatewayPage';
import PaymentVerificationPage from './pages/PaymentVerificationPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Box w="100%" minH="100vh">
        <Navbar />
        {/* Container Chakra akan memusatkan konten kita */}
        <Container as="main" maxW="container.xl" pt="150px">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
            <Route path="/lend" element={<ProtectedRoute><LendItemPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
            <Route path="/checkout/:id" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            
            <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
            <Route path="/payment/verifying" element={<PaymentVerificationPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;