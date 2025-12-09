// src/pages/CatalogPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 

import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Text, 
  VStack, 
  Container,
  useToast 
} from '@chakra-ui/react';

import ProductCard from '../components/ProductCard';
import CatalogHeader from '../components/CatalogHeader';

// --- DATA DUMMY (PASTI MUNCUL) ---
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Kamera Canon EOS R5",
    category: "Photography",
    price: 500000,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    lender_name: "Budi Kamera"
  },
  {
    id: 2,
    name: "Bor Listrik Bosch Impact",
    category: "Tools",
    price: 150000,
    image_url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    lender_name: "Toko Pak Jaya"
  },
  {
    id: 3,
    name: "Toyota Avanza Veloz",
    category: "Vehicles",
    price: 350000,
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    lender_name: "Rental Mobil Cepat"
  },
  {
    id: 4,
    name: "Macbook Pro M1 Max",
    category: "Electronics",
    price: 250000,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60",
    rating: 5.0,
    lender_name: "Gadget Rent"
  },
  {
    id: 5,
    name: "DJI Mavic Air 2",
    category: "Photography",
    price: 300000,
    image_url: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    lender_name: "Drone Master"
  }
];

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const toast = useToast();

  // --- HARD FIX: STATE DIISI DUMMY SECARA LANGSUNG ---
  // Kita tidak mulai dari array kosong [], tapi langsung DUMMY_PRODUCTS
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  
  // State Filter
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');
  const [view, setView] = useState('grid'); 

  // Fetch Data Supabase (Opsional - akan menimpa dummy jika database terkoneksi)
  useEffect(() => {
    async function fetchRealData() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          console.log("Data asli ditemukan, mengganti dummy...");
          setProducts(data);
        }
      } catch (err) {
        console.log("Gagal koneksi database, tetap menggunakan dummy.");
      }
    }
    fetchRealData();
  }, []);

  // Logika Filter & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        return 0; 
      });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={2}>Katalog Produk</Heading>
      <Text color="gray.500" mb={8}>Temukan alat yang kamu butuhkan untuk proyekmu.</Text>
      
      {/* Header dengan Filter */}
      <CatalogHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        view={view}
        onViewChange={setView}
      />

      {/* Tampilan Grid/List Produk */}
      {filteredAndSortedProducts.length === 0 ? (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
          <Heading size="md" color="gray.600">Tidak ada produk ditemukan</Heading>
          <Text mt={2}>Coba cari dengan kata kunci lain.</Text>
        </Box>
      ) : view === 'grid' ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} view="list" />
          ))}
        </VStack>
      )}
    </Container>
  );
}

export default CatalogPage;