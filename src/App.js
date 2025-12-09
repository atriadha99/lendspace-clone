import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

// Components
import Navbar from './components/Navbar';

// Pages (Gunakan file yang baru dibuat)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// import CatalogPage from './pages/CatalogPage'; // Uncomment jika sudah ada

function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      {/* Gunakan pt="80px" agar konten tidak tertutup Navbar fixed */}
      <Container maxW="container.xl" pt="80px" pb="10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/catalog" element={<CatalogPage />} /> */}
        </Routes>
      </Container>
    </Box>
  );
}

export default App;