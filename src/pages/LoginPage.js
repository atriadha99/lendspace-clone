// src/pages/LoginPage.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// 1. Import komponen form dan layout Chakra
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
} from '@chakra-ui/react';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate('/catalog');
  };

  return (
    // 2. Gunakan Container untuk membatasi lebar dan memusatkan
    <Container centerContent>
      {/* 3. Gunakan VStack untuk menata elemen form secara vertikal */}
      <VStack
        as="form" // Render sebagai <form>
        onSubmit={handleLogin}
        spacing={4} // Jarak antar elemen
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        w="100%"
        maxW="md" // Lebar maksimum
      >
        <Heading>Login to Lendspace</Heading>
        
        {/* 4. Bungkus input dengan FormControl */}
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Email Address" />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>
        
        <Button type="submit" colorScheme="red" w="100%">
          Login
        </Button>
      </VStack>
    </Container>
  );
}

export default LoginPage;