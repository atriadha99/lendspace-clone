// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// 1. Import komponen-komponen Chakra UI
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

// Daftar bank bisa dipindahkan ke file terpisah nanti
const bankOptions = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Danamon'];

function RegisterPage() {
  const [accountType, setAccountType] = useState('user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [idCard, setIdCard] = useState(null);
  const [selectedBank, setSelectedBank] = useState(bankOptions[0]);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIdCard(e.target.files[0]);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    const userData = { fullName, email, phone, password, accountType };

    if (accountType === 'lender') {
      userData.bank = selectedBank;
      userData.bankAccountNumber = bankAccountNumber;
      userData.idCardName = idCard ? idCard.name : 'No file uploaded';
    }

    console.log('Registering new account with data:', userData);
    alert(`Akun ${accountType} untuk ${fullName} berhasil dibuat!`);
    navigate('/login'); // Arahkan ke login setelah sukses
  };

  // 2. Siapkan warna dinamis untuk light/dark mode
  const typeBoxBorder = useColorModeValue('gray.200', 'gray.700');
  const typeBoxBgUser = useColorModeValue(accountType === 'user' ? 'red.50' : 'transparent', accountType === 'user' ? 'red.900' : 'transparent');
  const typeBoxBgLender = useColorModeValue(accountType === 'lender' ? 'red.50' : 'transparent', accountType === 'lender' ? 'red.900' : 'transparent');
  const verificationBg = useColorModeValue('red.50', 'gray.700');

  return (
    // 3. Gunakan <Container> untuk memusatkan konten
    <Container centerContent py={10}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Create Your Lendspace Account
      </Heading>
      
      {/* 4. Ganti <form> dengan <VStack> */}
      <VStack
        as="form"
        onSubmit={handleRegister}
        spacing={4} // Jarak antar elemen
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        w="100%"
        maxW="lg" // Batasi lebar form
      >
        {/* 5. Ganti .account-type-selector dengan <HStack> */}
        <HStack spacing={4} w="100%" mb={4}>
          <Box
            flex={1}
            p={5}
            borderWidth="2px"
            borderRadius="md"
            textAlign="center"
            cursor="pointer"
            onClick={() => setAccountType('user')}
            bg={typeBoxBgUser}
            borderColor={accountType === 'user' ? 'red.500' : typeBoxBorder}
            transition="all 0.2s"
          >
            <Heading size="3xl">👤</Heading>
            <Heading size="md" mt={2}>I want to rent</Heading>
          </Box>
          <Box
            flex={1}
            p={5}
            borderWidth="2px"
            borderRadius="md"
            textAlign="center"
            cursor="pointer"
            onClick={() => setAccountType('lender')}
            bg={typeBoxBgLender}
            borderColor={accountType === 'lender' ? 'red.500' : typeBoxBorder}
            transition="all 0.2s"
          >
            <Heading size="3xl">🏪</Heading>
            <Heading size="md" mt={2}>I want to lend</Heading>
          </Box>
        </HStack>

        {/* 6. Ganti <label> dan <input> dengan <FormControl> */}
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input type="tel" placeholder="081234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Create Password</FormLabel>
          <Input type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>

        {/* 7. Render kondisional bagian verifikasi lender */}
        {accountType === 'lender' && (
          <VStack
            w="100%"
            p={5}
            bg={verificationBg}
            borderRadius="md"
            borderWidth="1px"
            align="flex-start" // Ratakan label ke kiri
            spacing={4}
            mt={4}
          >
            <Heading size="md">Lender Verification</Heading>
            
            <FormControl isRequired>
              <FormLabel>Upload ID Card (KTP)</FormLabel>
              <Input type="file" p={1.5} onChange={handleFileChange} />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Bank Name</FormLabel>
              <Select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                {bankOptions.map(bank => <option key={bank} value={bank}>{bank}</option>)}
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Bank Account Number</FormLabel>
              <Input type="text" placeholder="For receiving rental payments" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} />
            </FormControl>
          </VStack>
        )}

        {/* 8. Ganti <button> dengan <Button> */}
        <Button type="submit" colorScheme="red" size="lg" w="100%" mt={4}>
          Create Account
        </Button>

        {/* 9. Ganti link auth switch */}
        <Text mt={4}>
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="red.500" fontWeight="bold">
            Login here
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}

export default RegisterPage;