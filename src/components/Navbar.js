import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Box, Flex, Text, Button, Stack, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem, Avatar,
  IconButton, Collapse, useDisclosure, HStack
} from '@chakra-ui/react';
// PERBAIKAN 1: Tambahkan ChatIcon di sini
import { HamburgerIcon, CloseIcon, AddIcon, ChatIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

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
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useColorModeValue('left', 'center')}
            fontFamily={'heading'}
            fontWeight="bold"
            fontSize="xl"
            color={useColorModeValue('red.500', 'white')}
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            Lendspace
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4} align="center">
              <Link to="/">Home</Link>
              {user && (
                <>
                  <Link to="/my-rentals">Riwayat Sewa</Link>
                  <Link to="/incoming-orders">Pesanan Masuk</Link>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
          {user ? (
            <HStack spacing={4}>
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

              {/* PERBAIKAN 2: Tombol Inbox ditaruh DI LUAR MenuButton, tapi masih di dalam HStack */}
              <IconButton
                as={Link}
                to="/inbox"
                aria-label="Inbox"
                icon={<ChatIcon />}
                variant="ghost"
                colorScheme="red"
                size="md"
              />

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

      <Collapse in={isOpen} animateOpacity>
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
          <Link to="/" onClick={onToggle}>Home</Link>
          {user && (
             <>
               <Link to="/inbox" onClick={onToggle}>Inbox Chat</Link> {/* Tambahan menu mobile */}
               <Link to="/my-rentals" onClick={onToggle}>Riwayat Sewa</Link>
               <Link to="/incoming-orders" onClick={onToggle}>Pesanan Masuk</Link>
               <Link to="/add-product" onClick={onToggle}>Sewakan Barang</Link>
               <Link to="/edit-profile" onClick={onToggle}>Edit Profil</Link>
             </>
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;