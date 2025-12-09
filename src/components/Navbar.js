// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// 1. Import komponen Chakra UI (Termasuk Button yang sebelumnya error)
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  useColorMode,
  useColorModeValue,
  Link,
  VStack
} from '@chakra-ui/react';
import { SearchIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';

const Navbar = () => {
  // 2. Ambil 'user' dan 'logout' dari AuthContext (Memperbaiki error 'user is not defined')
  const { user, logout } = useContext(AuthContext);
  
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  // State lokal untuk pencarian (opsional, agar input bisa diketik)
  const [searchTerm, setSearchTerm] = useState('');

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${searchTerm}`);
    }
  };

  return (
    <Box 
      as="header" 
      position="fixed" 
      top="0" 
      w="100%" 
      zIndex="1000" 
      bg={bg} 
      borderBottom="1px" 
      borderColor={borderColor} 
      px={4} 
      py={3}
    >
      <Flex alignItems="center" gap={4} maxW="1200px" mx="auto">
        {/* Logo */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Heading size="lg" color="red.500" cursor="pointer">Lendspace</Heading>
        </Link>

        {/* Kategori Button (Hanya tampil di Desktop) */}
        <Button variant="ghost" display={{ base: 'none', md: 'block' }}>Kategori</Button>

        {/* Search Bar */}
        <Box flex="1" as="form" onSubmit={handleSearch}>
          <InputGroup size="md">
            <Input 
              placeholder="Cari barang di Lendspace..." 
              borderRadius="md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightElement>
              <IconButton 
                icon={<SearchIcon />} 
                size="sm" 
                variant="ghost" 
                aria-label="Search" 
                type="submit"
              />
            </InputRightElement>
          </InputGroup>
        </Box>

        {/* Actions (Login/Register/Theme/Profile) */}
        <HStack spacing={2}>
          <IconButton 
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} 
            onClick={toggleColorMode} 
            variant="ghost" 
            aria-label="Toggle Theme"
          />
          
          {user ? (
            <>
              <Link as={RouterLink} to="/profile">
                <Button variant="ghost">Profil</Button>
              </Link>
              <Button colorScheme="red" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Masuk</Button>
              <Button colorScheme="red" size="sm" onClick={() => navigate('/register')}>Daftar</Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;