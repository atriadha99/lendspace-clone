// src/components/CategoryGrid.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// --- INI BAGIAN YANG DIPERBAIKI ---
// Impor komponen yang benar-benar digunakan di file ini
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  LinkBox,
  LinkOverlay,
  useColorModeValue, // Hook untuk dark/light mode
} from '@chakra-ui/react';
// --- AKHIR PERBAIKAN ---

const categories = [
  { name: 'Photography', icon: '📷' },
  { name: 'Tools', icon: '🔧' },
  { name: 'Vehicles', icon: '🚗' },
  { name: 'Event Gear', icon: '🎬' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Books', icon: '📚' },
  { name: 'More', icon: '➕' },
];

function CategoryGrid() {
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box as="section" mb={12}>
      <Heading as="h3" size="lg" mb={6}>
        Kategori Pilihan
      </Heading>
      <SimpleGrid columns={{ base: 4, md: 8 }} spacing={6}>
        {categories.map(cat => (
          <LinkBox as="article" key={cat.name}>
            <VStack
              p={4}
              bg={cardBg}
              borderRadius="lg"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Text fontSize="4xl">{cat.icon}</Text>
              <LinkOverlay as={RouterLink} to={`/catalog?category=${cat.name}`}>
                <Text fontWeight="medium" textAlign="center">{cat.name}</Text>
              </LinkOverlay>
            </VStack>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default CategoryGrid;