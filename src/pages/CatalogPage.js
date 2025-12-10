// src/pages/CatalogPage.js
import React, { useState, useMemo, useEffect } from 'react';
// 1. TAMBAHKAN useNavigate DI SINI
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 

import { 
  Box, Heading, SimpleGrid, Text, VStack, Container, Input, InputGroup,
  InputLeftElement, Select, HStack, Button, Image, Badge, Flex, useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';

const DUMMY_PRODUCTS = [
  { id: 1, name: "Kamera Canon EOS R5 (Demo)", category: "Photography", price: 500000, image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", rating: 4.9, lender_name: "Budi Kamera" },
  { id: 2, name: "Bor Listrik Bosch (Demo)", category: "Tools", price: 150000, image_url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407", rating: 4.7, lender_name: "Pak Jaya" },
  { id: 3, name: "Toyota Avanza (Demo)", category: "Vehicles", price: 350000, image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2", rating: 4.8, lender_name: "Rental Cepat" }
];

const ProductCard = ({ product }) => {
  // 2. INISIALISASI NAVIGASI DI DALAM KARTU
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Box 
      bg={bg} 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      shadow="sm"
      // 3. TAMBAHKAN EVENT KLIK & CURSOR POINTER
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)', shadow: 'md' }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Image src={product.image_url} alt={product.name} h="200px" w="100%" objectFit="cover" />
      <Box p={4}>
        <Flex justify="space-between" align="baseline">
          <Badge colorScheme="red">{product.category}</Badge>
          <HStack><StarIcon color="yellow.400" w={3}/><Text fontSize="xs">{product.rating}</Text></HStack>
        </Flex>
        <Heading size="md" mt={2} noOfLines={1}>{product.name}</Heading>
        <Text fontSize="sm" color="gray.500">Oleh {product.lender_name}</Text>
        <Text fontWeight="bold" fontSize="lg" color="red.500" mt={2}>
          Rp {product.price.toLocaleString('id-ID')} / hari
        </Text>
      </Box>
    </Box>
  );
};

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    async function fetchRealData() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) setProducts(data);
      } catch (err) { console.log("Menggunakan dummy."); }
    }
    fetchRealData();
  }, []);

  const filteredProducts = useMemo(() => {
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
      
      <VStack spacing={4} mb={8}>
        <Flex w="100%" gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.300" /></InputLeftElement>
            <Input placeholder="Cari barang..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <Select w={{ base: '100%', md: '200px' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </Select>
        </Flex>
        <HStack w="100%" overflowX="auto" pb={2}>
          {['All', 'Photography', 'Tools', 'Vehicles', 'Electronics'].map(cat => (
            <Button 
              key={cat} size="sm" 
              colorScheme={selectedCategory === cat ? 'red' : 'gray'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </HStack>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default CatalogPage;