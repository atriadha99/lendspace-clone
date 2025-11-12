// src/ProductCard.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Image, 
  Text, 
  Badge, 
  Heading, 
  LinkBox, 
  LinkOverlay 
} from '@chakra-ui/react';
import StarRating from './StarRating';

function ProductCard({ product }) {
  // Ambil data dari prop (atau beri nilai default)
  const { id, imageUrl, category, name, price, rating } = product;

  return (
    // 1. LinkBox adalah cara Chakra untuk membuat seluruh kartu bisa diklik
    <LinkBox 
      as="article"
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      bg="chakra-body-bg" // Otomatis ganti di dark/light mode
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }} // Efek hover
      transition="all 0.2s ease-in-out"
    >
      <Image src={imageUrl || 'https://via.placeholder.com/300'} alt={name} h="180px" w="100%" objectFit="cover" />

      <Box p={4}>
        {/* 2. Badge untuk kategori */}
        <Badge borderRadius="full" px="2" colorScheme="red">
          {category || 'Uncategorized'}
        </Badge>

        {/* 3. LinkOverlay adalah link yang sesungguhnya */}
        <LinkOverlay as={RouterLink} to={`/product/${id}`}>
          <Heading as="h4" size="sm" mt="2" noOfLines={1}>
            {name || 'Nama Produk'}
          </Heading>
        </LinkOverlay>

        {/* 4. Tampilkan rating jika ada */}
        {rating && <StarRating rating={rating} />}

        <Text fontWeight="bold" fontSize="lg" color="red.500" mt="2">
          {price || 'Rp 0'}
        </Text>
      </Box>
    </LinkBox>
  );
}

export default ProductCard;