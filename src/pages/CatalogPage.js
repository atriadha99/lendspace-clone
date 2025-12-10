// src/pages/CatalogPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 

// 1. Impor komponen Chakra UI
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Text, 
  VStack, 
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Button,
  Image,
  Badge,
  Flex,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';

// --- DATA DUMMY (PASTI MUNCUL) ---
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Kamera Canon EOS R5",
    category: "Photography",
    price: 500000,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    lender_name: "Budi Kamera",
    location: "Jakarta Selatan"
  },
  {
    id: 2,
    name: "Bor Listrik Bosch Impact",
    category: "Tools",
    price: 150000,
    image_url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    lender_name: "Toko Pak Jaya",
    location: "Bandung"
  },
  {
    id: 3,
    name: "Toyota Avanza Veloz",
    category: "Vehicles",
    price: 350000,
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    lender_name: "Rental Mobil Cepat",
    location: "Tangerang"
  },
  {
    id: 4,
    name: "Macbook Pro M1 Max",
    category: "Electronics",
    price: 250000,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60",
    rating: 5.0,
    lender_name: "Gadget Rent",
    location: "Jakarta Barat"
  },
  {
    id: 5,
    name: "DJI Mavic Air 2",
    category: "Photography",
    price: 300000,
    image_url: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    lender_name: "Drone Master",
    location: "Depok"
  }
];

// --- KOMPONEN KARTU PRODUK (Inline) ---
// Saya masukkan di sini agar tidak error jika file components/ProductCard.js hilang
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box 
      bg={bg} 
      borderWidth="1px" 
      borderColor={border}
      borderRadius="lg" 
      overflow="hidden" 
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
      onClick={() => navigate(`/product/${product.id}`)} // Nanti buat halaman detail
    >
      <Image src={product.image_url} alt={product.name} h="200px" w="100%" objectFit="cover" />
      
      <Box p={4}>
        <Flex justify="space-between" align="baseline" mb={2}>
          <Badge borderRadius="full" px="2" colorScheme="red">
            {product.category}
          </Badge>
          <HStack spacing={1}>
            <StarIcon color="yellow.400" w={3} h={3} />
            <Text fontSize="xs" fontWeight="bold" color="gray.500">{product.rating}</Text>
          </HStack>
        </Flex>

        <Heading size="md" mb={1} noOfLines={2}>
          {product.name}
        </Heading>
        
        <Text fontSize="sm" color="gray.500" mb={3}>
          Oleh {product.lender_name} • {product.location}
        </Text>

        <Text fontWeight="bold" fontSize="lg" color="red.500">
          Rp {product.price.toLocaleString('id-ID')}
          <Text as="span" fontSize="sm" color="gray.500" fontWeight="normal"> / hari</Text>
        </Text>
      </Box>
    </Box>
  );
};

// --- HALAMAN UTAMA KATALOG ---
function CatalogPage() {
  const [searchParams] = useSearchParams();
  
  // 1. INISIALISASI LANGSUNG DENGAN DUMMY (Supaya tidak blank)
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  
  // State Filter
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');

  // 2. Fetch Data Supabase (Opsional - menimpa dummy jika ada data)
 // Fetch Data Supabase
  useEffect(() => {
    async function fetchRealData() {
      try {
        console.log("Sedang mengambil data dari Supabase...");
        
        // Select semua kolom, urutkan dari yang terbaru
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error mengambil data:", error.message);
          throw error;
        }

        // Cek di Console Browser (F12) untuk melihat data asli
        console.log("Data berhasil diambil:", data);

        if (data && data.length > 0) {
          // Normalisasi data (jaga-jaga jika ada field yang null)
          const validData = data.map(item => ({
            ...item,
            // Jika image_url kosong/rusak, pakai gambar placeholder
            image_url: item.image_url || "https://via.placeholder.com/300?text=No+Image",
            // Jika rating kosong, kasih default
            rating: item.rating || 0,
            // Jika kategori kosong, masukkan ke 'Others'
            category: item.category || 'Others'
          }));
          
          setProducts(validData);
        } else {
          console.warn("Database kosong atau RLS memblokir data.");
          // Opsional: Tetap pakai dummy jika DB kosong, atau biarkan kosong
          // setProducts(DUMMY_PRODUCTS); 
        }
      } catch (err) {
        console.log("Gagal koneksi, menggunakan data dummy.");
        // setProducts(DUMMY_PRODUCTS); // Uncomment jika ingin fallback ke dummy saat error
      }
    }
    fetchRealData();
  }, []);

  // 3. Logika Filter & Sorting
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
      <Text color="gray.500" mb={8}>Temukan alat yang kamu butuhkan untuk proyekmu.</Text>
      
      {/* FILTER BAR */}
      <VStack spacing={4} mb={8}>
        {/* Baris 1: Search & Sort */}
        <Flex w="100%" gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.300" /></InputLeftElement>
            <Input 
              placeholder="Cari barang (Kamera, Bor, Mobil...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Select w={{ base: '100%', md: '200px' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </Select>
        </Flex>

        {/* Baris 2: Kategori Buttons */}
        <HStack w="100%" overflowX="auto" pb={2}>
          {['All', 'Photography', 'Tools', 'Vehicles', 'Electronics'].map(cat => (
            <Button 
              key={cat}
              size="sm"
              colorScheme={selectedCategory === cat ? 'red' : 'gray'}
              variant={selectedCategory === cat ? 'solid' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              flexShrink={0}
            >
              {cat}
            </Button>
          ))}
        </HStack>
      </VStack>

      {/* HASIL PENCARIAN (GRID) */}
      {filteredProducts.length === 0 ? (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
          <Heading size="md" color="gray.600">Tidak ada produk ditemukan</Heading>
          <Text mt={2}>Coba cari dengan kata kunci lain.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default CatalogPage;