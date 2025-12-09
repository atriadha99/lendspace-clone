// src/pages/CatalogPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 

// 1. Impor komponen Chakra UI
import { Box, Heading, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';

// 2. Impor komponen kustom
import ProductCard from '../components/ProductCard';
import CatalogHeader from '../components/CatalogHeader';

function CatalogPage() {
  const [searchParams] = useSearchParams();

  // 3. State Data & Loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. State Filter & Sorting (Ini yang sebelumnya hilang)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');
  const [view, setView] = useState('grid'); // 'grid' atau 'list'

  // 5. Fetch Data dari Supabase
  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.warn("Gagal mengambil data:", error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    
    getProducts();
  }, []);

  // 6. Logika Filter & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filter berdasarkan pencarian nama
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Filter berdasarkan kategori
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Sorting harga
        if (sortOrder === 'price-asc') {
          return a.price - b.price;
        }
        if (sortOrder === 'price-desc') {
          return b.price - a.price;
        }
        return 0; // default (urutan database)
      });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  // 7. Tampilan Loading
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Heading size="md" mt={4}>Memuat produk...</Heading>
      </Box>
    );
  }

  // 8. Tampilan Utama
  return (
    <Box py={8}>
      <Heading as="h1" size="xl" mb={6}>Katalog Produk</Heading>
      
      {/* Header dengan Filter, Search, dan View Toggle */}
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

      {/* Konten Produk */}
      {filteredAndSortedProducts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Heading size="md">Tidak ada produk yang cocok</Heading>
          <Text>Coba ganti kata kunci atau filter Anda.</Text>
        </Box>
      ) : view === 'grid' ? (
        // Tampilan GRID
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        // Tampilan LIST
        <VStack spacing={6} align="stretch">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} view="list" />
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default CatalogPage;