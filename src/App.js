import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// --- IMPORT SEMUA HALAMAN ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetailPage from './pages/ProductDetailPage';
import MyRentalsPage from './pages/MyRentalsPage';
import ChatPage from './pages/ChatPage';
import InboxPage from './pages/InboxPage';
import TermsPage from './pages/TermsPage';
import CatalogPage from './pages/CatalogPage';

// --- IMPORT HALAMAN YANG TADI ERROR ---
import AddProductPage from './pages/AddProductPage';
import EditProfilePage from './pages/EditProfilePage';
import IncomingOrdersPage from './pages/IncomingOrdersPage';

function App() {
  return (
    <div className="App">
      {/* Navbar muncul di semua halaman */}
      <Navbar />

      {/* Daftar Rute (Peta Aplikasi) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Halaman yang butuh Login */}
        <Route path="/my-rentals" element={<MyRentalsPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/chat/:receiverId" element={<ChatPage />} />

        {/* --- INI YANG MEMPERBAIKI ERROR 'NO ROUTES MATCHED' --- */}
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/incoming-orders" element={<IncomingOrdersPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        
      </Routes>
    </div>
  );
}

export default App;