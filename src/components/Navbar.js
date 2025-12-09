// src/components/Navbar.jsx
import { Box, Flex, Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999"
      bg={scrolled ? 'rgba(0,0,0,0.95)' : 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'}
      transition="all 0.4s"
      py={4}
      px={8}
    >
      {user && (
  <Button onClick={toggleRole} colorScheme={user.role === 'lender' ? 'red' : 'gray'}>
    Mode: {user.role === 'lender' ? 'Lender' : 'Buyer'}
  </Button>
)}
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        <Flex align="center" gap={10}>
          <Heading size="xl" color="#E50914" fontWeight="900" letterSpacing="tight">
            LENDSPACE
          </Heading>
          <Flex gap={8} fontWeight="600" display={{ base: 'none', md: 'flex' }}>
            <Box _hover={{ color: '#E50914' }}>Beranda</Box>
            <Box _hover={{ color: '#E50914' }}>Barang</Box>
            <Box _hover={{ color: '#E50914' }}>Jasa</Box>
            <Box _hover={{ color: '#E50914' }}>Trending</Box>
          </Flex>
        </Flex>

        <InputGroup maxW="500px" bg="rgba(0,0,0,0.6)" border="1px solid #333">
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Cari kamera, mobil, fotografer, alat berat..." variant="filled" />
        </InputGroup>
      </Flex>
    </Box>
  );
}