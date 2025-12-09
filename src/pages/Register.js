// src/pages/Register.js
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

export default function Register() {
  const { register } = useContext(AuthContext); // Asumsi fungsi register ada di context
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const bgBox = useColorModeValue('white', 'gray.800');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Panggil fungsi register dari AuthContext (Supabase)
      const { user, error } = await register(email, password, fullName);
      if (error) throw error;

      toast({
        title: "Akun Berhasil Dibuat.",
        description: "Silakan cek email untuk verifikasi (jika diaktifkan) atau login.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/'); // Redirect ke home
    } catch (error) {
      toast({
        title: "Gagal Mendaftar",
        description: error.message,
        status: "error",
        duration: 5000,
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
          <Heading fontSize={'4xl'} textAlign={'center'}>Buat Akun Lendspace</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Mulai sewa atau sewakan barang sekarang!
          </Text>
        </Stack>
        <Box rounded={'lg'} bg={bgBox} boxShadow={'lg'} p={8}>
          <Stack spacing={4} as="form" onSubmit={handleRegister}>
            <FormControl id="fullName" isRequired>
              <FormLabel>Nama Lengkap</FormLabel>
              <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Mendaftar"
                size="lg"
                bg={'red.400'}
                color={'white'}
                _hover={{ bg: 'red.500' }}
                isLoading={loading}
                type="submit"
              >
                Daftar
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Sudah punya akun? <Link as={RouterLink} to="/login" color={'red.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}