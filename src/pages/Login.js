// src/pages/Login.js
import React, { useState, useContext } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgBox = useColorModeValue('white', 'gray.800');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, error } = await login(email, password);
      if (error) throw error;
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Arahkan ke home setelah login
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH={'80vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Masuk ke Akun Anda</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            untuk mulai menyewa barang <Text as="span" color={'red.400'}>impian</Text> ✌️
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={bgBox} boxShadow={'lg'} p={8}>
          <Stack spacing={4} as="form" onSubmit={handleLogin}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'red.400'}
                color={'white'}
                _hover={{ bg: 'red.500' }}
                isLoading={loading}
                type="submit"
              >
                Masuk
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Belum punya akun? <Link as={RouterLink} to="/register" color={'red.400'}>Daftar</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}