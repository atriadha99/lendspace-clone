// src/pages/CatalogPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

// 1. Impor komponen Chakra UI yang diperlukan
import { Box, Heading, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';

// 2. Impor komponen kustom Anda
import ProductCard from '../components/ProductCard';
import CatalogHeader from '../components/CatalogHeader';

function CatalogPage() {
  const [searchParams] = useSearchParams();

  // 3. State untuk data dari database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. State untuk filter (yang sebelumnya hilang)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');
  const [view, setView] = useState('grid'); // 'grid' atau 'list'

  // 5. useEffect untuk mengambil data (kode Anda sudah benar 👍)
  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.warn(error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    
    getProducts();
  }, []);

  // 6. Logika useMemo untuk filter & sort (yang sebelumnya hilang)
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Asumsi 'price' adalah angka di database Anda
        if (sortOrder === 'price-asc') {
          return a.price - b.price;
        }
        if (sortOrder === 'price-desc') {
          return b.price - a.price;
        }
        return 0; // 'default'
      });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  // 7. Tampilkan loading spinner (kode Anda sudah benar)
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Heading size="md" mt={4}>Memuat produk...</Heading>
      </Box>
    );
  }

  // 8. Tampilkan halaman katalog
  return (
    <Box py={8}>
      <Heading as="h1" size="xl" mb={6}>Katalog Produk</Heading>
      
      {/* Semua state filter sekarang terhubung dengan benar */}
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

      {/* 9. Render produk (HANYA SEKALI) */}
      {filteredAndSortedProducts.length === 0 ? (
        // Tampilan jika tidak ada hasil
        <Box textAlign="center" py={10}>
          <Heading size="md">Tidak ada produk yang cocok</Heading>
          <Text>Coba ganti kata kunci atau filter Anda.</Text>
        </Box>
      ) : view === 'grid' ? (
        // Tampilan GRID (menggunakan SimpleGrid)
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        // Tampilan LIST (menggunakan VStack)
        <VStack spacing={6} align="stretch">
          {filteredAndSortedProducts.map(product => (
            // Kita asumsikan ProductCard.js Anda bisa menangani prop 'view="list"'
            <ProductCard key={product.id} product={product} view="list" />
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default CatalogPage;