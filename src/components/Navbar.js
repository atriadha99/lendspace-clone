import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Box, Flex, Text, Button, Stack, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem, Avatar,
  IconButton, Collapse, useDisclosure, HStack, Icon
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon, ChatIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // --- LOGIC AUTH ---
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        {/* 1. TOMBOL HAMBURGER (MOBILE ONLY) */}
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        {/* 2. LOGO & MENU DESKTOP */}
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useColorModeValue('left', 'center')}
            fontFamily={'heading'}
            fontWeight="bold"
            fontSize="xl"
            color={'red.500'}
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            Lendspace
          </Text>

          {/* Desktop Links */}
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4} align="center">
              <DesktopLink to="/" label="Home" />
              {user && (
                <>
                  <DesktopLink to="/my-rentals" label="Riwayat Sewa" />
                  <DesktopLink to="/incoming-orders" label="Pesanan Masuk" />
                </>
              )}
            </Stack>
          </Flex>
        </Flex>

        {/* 3. TOMBOL KANAN (User / Login) */}
        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
          {user ? (
            <HStack spacing={2}>
              {/* Tombol Sewakan (Desktop) */}
              <Button
                as={Link}
                to="/add-product"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'red.500'}
                _hover={{ bg: 'red.400' }}
                leftIcon={<AddIcon boxSize={3} />}
              >
                Sewakan Barang
              </Button>

              {/* Tombol Chat */}
              <IconButton
                as={Link}
                to="/inbox"
                aria-label="Inbox"
                icon={<ChatIcon />}
                variant="ghost"
                colorScheme="red"
                size="md"
              />

              {/* Avatar Dropdown */}
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar size={'sm'} src={profile?.avatar_url} name={profile?.full_name} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/edit-profile')}>Edit Profil</MenuItem>
                  <MenuItem onClick={() => navigate('/add-product')}>Sewakan Barang</MenuItem>
                  <MenuItem onClick={() => navigate('/incoming-orders')}>Pesanan Masuk</MenuItem>
                  <MenuItem onClick={() => navigate('/my-rentals')}>Riwayat Sewa</MenuItem>
                  <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <>
              <Button as={Link} to="/login" fontSize={'sm'} fontWeight={400} variant={'link'}>
                Masuk
              </Button>
              <Button
                as={Link}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'red.500'}
                _hover={{ bg: 'red.400' }}
              >
                Daftar
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      {/* 4. MENU MOBILE (COLLAPSE) */}
      <Collapse in={isOpen} animateOpacity>
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }} borderBottom="1px" borderColor="gray.200">
          
          <MobileNavItem label="Home" to="/" onClick={onToggle} />
          
          {user && (
             <>
               <Text fontWeight="bold" color="gray.500" fontSize="xs" mt={2} mb={1} textTransform="uppercase">Menu Penyewa</Text>
               <MobileNavItem label="Inbox Chat" to="/inbox" onClick={onToggle} />
               <MobileNavItem label="Riwayat Sewa" to="/my-rentals" onClick={onToggle} />
               
               <Text fontWeight="bold" color="gray.500" fontSize="xs" mt={2} mb={1} textTransform="uppercase">Menu Pemilik</Text>
               <MobileNavItem label="Sewakan Barang" to="/add-product" onClick={onToggle} />
               <MobileNavItem label="Pesanan Masuk" to="/incoming-orders" onClick={onToggle} />
               
               <Text fontWeight="bold" color="gray.500" fontSize="xs" mt={2} mb={1} textTransform="uppercase">Akun</Text>
               <MobileNavItem label="Edit Profil" to="/edit-profile" onClick={onToggle} />
               <Button size="sm" colorScheme="red" variant="outline" w="full" mt={2} onClick={handleLogout}>
                 Logout
               </Button>
             </>
          )}

          {!user && (
            <Stack mt={4}>
              <Button as={Link} to="/login" w="full" variant="outline">Masuk</Button>
              <Button as={Link} to="/register" w="full" colorScheme="red">Daftar</Button>
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};

// --- KOMPONEN KECIL UNTUK TOMBOL MOBILE YANG RAPI ---
const MobileNavItem = ({ label, to, onClick }) => {
  return (
    <Stack spacing={4} onClick={onClick}>
      <Flex
        py={2}
        as={Link}
        to={to}
        justify={'space-between'}
        align={'center'}
        _hover={{ textDecoration: 'none' }}>
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        <Icon as={ChevronRightIcon} w={5} h={5} color="gray.400" />
      </Flex>
    </Stack>
  );
};

// --- KOMPONEN KECIL UNTUK TOMBOL DESKTOP ---
const DesktopLink = ({ to, label }) => (
  <Link to={to}>
    <Text 
      fontSize="sm" 
      fontWeight={500} 
      _hover={{ textDecoration: 'none', color: 'red.500' }}
    >
      {label}
    </Text>
  </Link>
);

export default Navbar;