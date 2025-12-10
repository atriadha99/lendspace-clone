import React from 'react';
import { Container, Heading, Text, VStack, Box } from '@chakra-ui/react';

export default function TermsPage() {
  return (
    <Container maxW="container.md" py={10}>
      <VStack align="start" spacing={6}>
        <Heading>Syarat & Ketentuan</Heading>
        
        <Box>
          <Heading size="md" mb={2}>1. Uang Jaminan (Security Deposit)</Heading>
          <Text>Penyewa wajib menyerahkan deposit atau identitas asli sebagai jaminan keamanan barang selama masa sewa.</Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>2. Denda & Kerusakan</Heading>
          <Text>Segala kerusakan yang terjadi selama masa sewa adalah tanggung jawab penyewa sepenuhnya.</Text>
        </Box>
      </VStack>
    </Container>
  );
}