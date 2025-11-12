// src/Navbar.js
import { Link as RouterLink, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle'; // Pastikan path ini benar

import {
  Box,
  Flex,
  Heading,
  Link,
  HStack,
  VStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${searchTerm}`);
    }
  };

  return (
    <Box
      as="header"
      bg="chakra-body-bg" // Otomatis ganti dark/light
      w="100%"
      p={4}
      borderBottomWidth="1px"
      position="fixed"
      top="0"
      zIndex="1000"
    >
      <VStack spacing={3}>
        <Flex w="100%" align="center" gap={4}>
          <Link as={RouterLink} to="/">
            <Heading size="lg" color="red.500">Lendspace</Heading>
          </Link>
          <Button variant="ghost">Kategori</Button>
          
          <Box as="form" flex={1} onSubmit={handleSearch}>
            <InputGroup>
              <Input 
                placeholder="Cari di Lendspace" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<SearchIcon />}
                  type="submit"
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </Box>
          
          <HStack spacing={3}>
            <ThemeToggle />
            {isAuthenticated ? (
              <Link as={RouterLink} to="/profile">
                <Button variant="outline">My Profile</Button>
              </Link>
            ) : (
              <>
                <Link as={RouterLink} to="/login">
                  <Button variant="outline">Masuk</Button>
                </Link>
                <Link as={RouterLink} to="/register">
                  <Button colorScheme="red">Daftar</Button>
                </Link>
              </>
            )}
          </HStack>
        </Flex>
        <HStack w="100%" justify="flex-start" spacing={6}>
          <Link as={RouterNavLink} to="/catalog?category=Photography">Kamera</Link>
          <Link as={RouterNavLink} to="/catalog?category=Tools">Alat Tukang</Link>
          <Link as={RouterNavLink} to="/catalog?category=Vehicles">Kendaraan</Link>
          <Link as={RouterNavLink} to="/lend">Jadi Lender</Link>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Navbar;