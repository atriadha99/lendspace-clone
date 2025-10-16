// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Halaman Publik ---
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// --- Halaman Setelah Login ---
import HomePage from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import LendItemPage from "./pages/LendItemPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";

// --- Pembayaran ---
import PaymentVerificationPage from "./pages/PaymentVerificationPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar akan muncul di semua halaman */}
        <Navbar />

        <main>
          <Routes>
            {/* --- Rute Publik --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Rute Setelah Login (Dilindungi) --- */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lend"
              element={
                <ProtectedRoute>
                  <LendItemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:id"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* --- Rute Pembayaran --- */}
            <Route path="/payment/verifying" element={<PaymentVerificationPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
