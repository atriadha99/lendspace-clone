// src/pages/WithdrawPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';

function WithdrawPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  
  const bgCard = useColorModeValue('white', 'gray.700');

  // Saldo Dummy
  const currentBalance = 500000; 

  const handleWithdraw = (e) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (!amount || amount < 10000) {
      toast({
        title: "Nominal tidak valid",
        description: "Minimal penarikan Rp 10.000",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (amount > currentBalance) {
      toast({
        title: "Saldo tidak cukup",
        description: "Pastikan nominal tidak melebihi saldo Anda.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    // Simulasi Proses Server
    setTimeout(() => {
      setLoading(false);
      // Arahkan ke halaman sukses
      navigate('/payment-success', { 
        state: { 
          title: 'Permintaan Terkirim',
          message: `Penarikan dana sebesar Rp ${parseInt(amount).toLocaleString('id-ID')} sedang diproses. Dana akan masuk dalam 1x24 jam.` 
        } 
      });
    }, 2000);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Tarik Dana</Heading>
        
        <Box p={6} bg={bgCard} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
          <Text color="gray.500" mb={1}>Saldo Tersedia</Text>
          <Heading size="xl" color="green.500" mb={6}>
            Rp {currentBalance.toLocaleString('id-ID')}
          </Heading>

          <VStack as="form" spacing={4} onSubmit={handleWithdraw}>
            <FormControl isRequired>
              <FormLabel>Pilih Bank Tujuan</FormLabel>
              <Select placeholder="Pilih Bank">
                <option value="bca">BCA</option>
                <option value="mandiri">Mandiri</option>
                <option value="bri">BRI</option>
                <option value="bni">BNI</option>
                <option value="gopay">GoPay</option>
                <option value="ovo">OVO</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Nomor Rekening / E-Wallet</FormLabel>
              <Input type="number" placeholder="Contoh: 1234567890" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Nominal Penarikan</FormLabel>
              <Input 
                type="number" 
                placeholder="Minimal Rp 10.000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>

            {/* Tombol Pilihan Cepat */}
            <HStack w="100%" spacing={2}>
              <Button size="xs" onClick={() => setAmount(50000)}>50rb</Button>
              <Button size="xs" onClick={() => setAmount(100000)}>100rb</Button>
              <Button size="xs" onClick={() => setAmount(currentBalance)}>Semua</Button>
            </HStack>

            <Button 
              type="submit" 
              colorScheme="green" 
              size="lg" 
              w="100%" 
              mt={4}
              isLoading={loading}
              loadingText="Memproses..."
            >
              Konfirmasi Penarikan
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default WithdrawPage;