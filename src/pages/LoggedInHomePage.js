// src/pages/LoggedInHomePage.js
import React from 'react';
import { productData } from '../data/products.js';
import ProductCarousel from '../components/ProductCarousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard'; // Komponen baru!

// 1. Import komponen layout Chakra
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';

function LoggedInHomePage() {
  const flashSaleProducts = productData.slice(0, 5);

  return (
    // 2. Gunakan <Box> sebagai container utama halaman
    <Box>
      <ProductCarousel />
      
      {/* 'main-content' diganti dengan <Box> dengan padding */}
      <Box py={8}>
        <CategoryGrid />
        
        <ProductRow 
          title="Flash Sale! ⚡"
          products={flashSaleProducts}
        />

        {/* Rekomendasi "Untuk Anda" */}
        <Box as="section" mt={12}>
          <Heading as="h3" size="lg" mb={6}>
            Rekomendasi Untuk Anda
          </Heading>
          
          {/* 3. SimpleGrid adalah pengganti CSS Grid yang canggih */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={6}>
            {productData.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}

export default LoggedInHomePage;