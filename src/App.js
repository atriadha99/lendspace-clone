// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';

// --- Halaman utama ---
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import LendItemPage from './pages/LendItemPage';

// --- Autentikasi ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Produk & Checkout ---
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';

// --- Pembayaran ---
import PaymentVerificationPage from './pages/PaymentVerificationPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

// --- Profil Pengguna ---
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            {/* --- Halaman utama --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/lend" element={<LendItemPage />} />

            {/* --- Autentikasi --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Produk & Checkout --- */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />

            {/* --- Pembayaran --- */}
            <Route path="/payment/verifying" element={<PaymentVerificationPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />

            {/* --- Profil Pengguna --- */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
