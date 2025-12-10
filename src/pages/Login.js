import React, { useState, useContext } from 'react';
import {
  Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text,
  useColorModeValue, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  // Hanya ambil fungsi login, 'user' tidak diperlukan di sini
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const bgBox = useColorModeValue('white', 'gray.700');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      
      toast({ title: "Login Berhasil", status: "success", duration: 3000 });
      navigate('/'); 
    } catch (error) {
      toast({ title: "Login Gagal", description: error.message, status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH={'80vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Masuk ke Akun</Heading>
          <Text fontSize={'lg'} color={'gray.500'}>Mulai sewa barang impianmu ✌️</Text>
        </Stack>
        <Box rounded={'lg'} bg={bgBox} boxShadow={'lg'} p={8}>
          <Stack spacing={4} as="form" onSubmit={handleLogin}>
            <FormControl id="email"><FormLabel>Email</FormLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl>
            <FormControl id="password"><FormLabel>Password</FormLabel><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></FormControl>
            <Button bg={'red.400'} color={'white'} _hover={{ bg: 'red.500' }} isLoading={loading} type="submit">Masuk</Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}