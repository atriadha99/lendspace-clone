// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Text
} from '@chakra-ui/react';
import { SearchIcon, SunIcon, MoonIcon, HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook untuk menu mobile (Drawer)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${searchTerm}`);
      onClose();
    }
  };

  return (
    <>
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
        <Flex alignItems="center" justify="space-between" maxW="1200px" mx="auto">
          
          {/* 1. LOGO & HAMBURGER (Mobile) */}
          <HStack spacing={4}>
            {/* Tombol Hamburger hanya muncul di Mobile (base: block, md: none) */}
            <IconButton 
              icon={<HamburgerIcon />} 
              variant="ghost" 
              display={{ base: 'flex', md: 'none' }} 
              onClick={onOpen}
              aria-label="Menu"
            />
            
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Heading size="lg" color="red.500" cursor="pointer">Lendspace</Heading>
            </Link>
          </HStack>

          {/* 2. SEARCH BAR (Hidden di Mobile agar tidak sempit) */}
          <Box 
            flex="1" 
            mx={8} 
            as="form" 
            onSubmit={handleSearch} 
            display={{ base: 'none', md: 'block' }} // Sembunyikan di HP
          >
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
                  type="submit"
                  aria-label="Search"
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* 3. DESKTOP MENU ACTIONS */}
          <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" as={RouterLink} to="/catalog">Katalog</Button>
            <IconButton 
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} 
              onClick={toggleColorMode} 
              variant="ghost" 
              aria-label="Toggle Theme"
            />
            
            {user ? (
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  Halo, {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">Profil Saya</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Masuk</Button>
                <Button colorScheme="red" size="sm" onClick={() => navigate('/register')}>Daftar</Button>
              </>
            )}
          </HStack>

          {/* 4. TOMBOL THEME & SEARCH ICON (Versi Mobile di Kanan) */}
          <HStack display={{ base: 'flex', md: 'none' }} spacing={1}>
             <IconButton 
                icon={<SearchIcon />} 
                variant="ghost" 
                onClick={onOpen} // Buka drawer utk search
                aria-label="Search Mobile"
             />
             <IconButton 
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} 
              onClick={toggleColorMode} 
              variant="ghost" 
              aria-label="Toggle Theme"
            />
          </HStack>

        </Flex>
      </Box>

      {/* --- MOBILE DRAWER (Menu Samping untuk HP) --- */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu Lendspace</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {/* Search Bar Mobile */}
              <Box as="form" onSubmit={handleSearch}>
                <InputGroup>
                  <Input 
                    placeholder="Cari barang..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton icon={<SearchIcon />} size="sm" type="submit" />
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Button variant="ghost" justifyContent="flex-start" as={RouterLink} to="/" onClick={onClose}>
                Beranda
              </Button>
              <Button variant="ghost" justifyContent="flex-start" as={RouterLink} to="/catalog" onClick={onClose}>
                Katalog Produk
              </Button>

              <Box borderTopWidth="1px" pt={4}>
                {user ? (
                  <>
                    <Text px={4} mb={2} fontWeight="bold" color="gray.500">Akun</Text>
                    <Button variant="ghost" w="full" justifyContent="flex-start" as={RouterLink} to="/profile" onClick={onClose}>
                      Profil Saya
                    </Button>
                    <Button colorScheme="red" w="full" mt={2} onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <VStack spacing={3}>
                    <Button w="full" variant="outline" onClick={() => { navigate('/login'); onClose(); }}>
                      Masuk
                    </Button>
                    <Button w="full" colorScheme="red" onClick={() => { navigate('/register'); onClose(); }}>
                      Daftar
                    </Button>
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;