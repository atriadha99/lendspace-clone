// src/pages/ProductDetailPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productData } from '../data/products.js';

// 1. Import komponen-komponen Chakra
import {
  Box,
  Grid,
  GridItem,
  Image,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';

// 2. Import komponen kustom kita
import StarRating from '../components/StarRating';
import BookingCalendar from '../components/BookingCalendar';
import LocationMap from '../components/LocationMap';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productData.find(p => p.id === parseInt(id));

  const handleRentNow = () => {
    navigate('/payment-gateway', { state: { product } });
  };

  if (!product) {
    return (
      <Box textAlign="center" py={20}>
        <Heading>Produk tidak ditemukan!</Heading>
      </Box>
    );
  }

  return (
    // 3. Gunakan Grid untuk layout 2 kolom yang responsif
    <Grid
      templateColumns={{ base: '1fr', lg: '2fr 1fr' }} // 1 kolom di mobile, 2 kolom di large
      gap={8}
      py={8}
    >
      {/* Kolom Kiri: Info Produk */}
      <GridItem>
        <VStack spacing={6} align="flex-start">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            borderRadius="lg" 
            objectFit="cover" 
            w="100%" 
            maxH="500px" 
          />
          <Badge colorScheme="red">{product.category}</Badge>
          <Heading as="h1" size="xl">{product.name}</Heading>

          <VStack align="flex-start" spacing={1}>
            <HStack>
              <StarRating rating={product.rating} />
              <Text>({product.totalReviews} ulasan)</Text>
            </HStack>
            <HStack>
              <Text color="gray.500">
                Disewakan oleh <strong>{product.lender.name}</strong>
              </Text>
              {product.lender.isTrusted && (
                <Badge colorScheme="orange">⭐ Lender Terpercaya</Badge>
              )}
            </HStack>
          </VStack>
          
          <Text fontSize="3xl" fontWeight="bold" color="red.500">
            {product.price}
            <Text as="span" fontSize="lg" color="gray.500" fontWeight="normal"> / hari</Text>
          </Text>

          <Heading as="h3" size="lg" pt={4}>Deskripsi Produk</Heading>
          <Text lineHeight="1.6">{product.description}</Text>
        </VStack>
      </GridItem>

      {/* Kolom Kanan: Kalender & Peta (Sidebar) */}
      <GridItem
        position={{ base: 'static', lg: 'sticky' }} // Sticky di layar besar
        top={{ base: '0', lg: '150px' }} // Beri ruang untuk navbar
        alignSelf="flex-start" // Jaga agar tetap di atas
      >
        <VStack spacing={6}>
          {/* Box untuk Kalender */}
          <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            p={4} 
            w="100%"
            bg="chakra-body-bg" // Otomatis dark/light mode
          >
            <Heading size="md" mb={4}>Pilih Tanggal Sewa</Heading>
            <BookingCalendar unavailableDates={product.unavailableDates} />
          </Box>
          
          {/* Box untuk Peta */}
          <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            w="100%" 
            h="300px"
            bg="chakra-body-bg"
            overflow="hidden" // Memastikan peta tetap di dalam border
          >
            <LocationMap position={product.location} name={product.name} />
          </Box>
          
          <Button 
            colorScheme="red" 
            size="lg" 
            w="100%" 
            onClick={handleRentNow}
          >
            Sewa Sekarang
          </Button>
        </VStack>
      </GridItem>
    </Grid>
  );
}

export default ProductDetailPage;