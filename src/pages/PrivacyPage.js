import React from 'react';
import { Container, Heading, Text, VStack, Box } from '@chakra-ui/react';

export default function PrivacyPage() {
  return (
    <Container maxW="container.md" py={10}>
      <VStack align="start" spacing={6}>
        <Heading>Kebijakan Privasi (Privacy Policy)</Heading>
        <Text color="gray.600">Terakhir diperbarui: {new Date().toLocaleDateString()}</Text>
        
        <Box>
          <Heading size="md" mb={2}>1. Data yang Kami Kumpulkan</Heading>
          <Text>Kami mengumpulkan data seperti Nama, Email, Nomor Telepon, dan Foto Identitas (KTP) untuk keperluan verifikasi keamanan sewa-menyewa.</Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>2. Penggunaan Data</Heading>
          <Text>Data KTP Anda hanya digunakan untuk verifikasi (KYC) dan tidak akan dibagikan ke publik. Nomor telepon hanya dibagikan kepada Lender/Penyewa setelah booking dikonfirmasi.</Text>
        </Box>
      </VStack>
    </Container>
  );
}