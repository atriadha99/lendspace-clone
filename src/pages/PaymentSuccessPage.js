// src/pages/PaymentSuccessPage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Icon, 
  useColorModeValue,
  Container
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mengambil data pesan dari halaman sebelumnya (Withdraw atau ProductDetail)
  // Jika tidak ada data (misal user langsung ketik URL), gunakan pesan default.
  const title = location.state?.title || 'Berhasil!';
  const message = location.state?.message || 'Transaksi Anda telah berhasil diproses.';

  const bgCard = useColorModeValue('white', 'gray.700');

  return (
    <Box minH="80vh" display="flex" alignItems="center" justify="center">
      <Container maxW="md">
        <VStack 
          bg={bgCard} 
          p={10} 
          borderRadius="2xl" 
          boxShadow="xl" 
          spacing={6} 
          textAlign="center" 
          borderWidth="1px"
          borderColor={useColorModeValue('gray.100', 'gray.600')}
        >
          {/* Ikon Centang Besar */}
          <Icon as={CheckCircleIcon} w={24} h={24} color="green.400" />
          
          <VStack spacing={2}>
            <Heading size="xl" color="green.500">{title}</Heading>
            <Text color="gray.500" fontSize="lg">
              {message}
            </Text>
          </VStack>

          <VStack w="full" spacing={3} pt={4}>
            <Button 
              colorScheme="green" 
              size="lg" 
              w="full" 
              onClick={() => navigate('/')}
            >
              Kembali ke Beranda
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              w="full"
              onClick={() => navigate('/profile')}
            >
              Cek Riwayat Transaksi
            </Button>
          </VStack>

        </VStack>
      </Container>
    </Box>
  );
}

export default PaymentSuccessPage;