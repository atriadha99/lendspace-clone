import React from 'react';
import { Container, Heading, Text, Box, VStack, UnorderedList, ListItem, Divider, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="4xl" py={10}>
      <VStack align="start" spacing={6}>
        <Button onClick={() => navigate(-1)} variant="link" colorScheme="gray" mb={4}>
          &larr; Kembali
        </Button>

        <Heading as="h1" size="2xl">Syarat dan Ketentuan</Heading>
        <Text color="gray.500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</Text>

        <Divider />

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>1. Pendahuluan</Heading>
          <Text align="justify" mb={4}>
            Selamat datang di Lendspace. Dengan mendaftar dan menggunakan layanan kami, Anda dianggap telah membaca, 
            memahami, dan menyetujui seluruh isi Syarat dan Ketentuan ini. Syarat dan ketentuan ini merupakan bentuk kesepakatan 
            yang dituangkan dalam sebuah perjanjian yang sah antara Pengguna dengan Pengelola Lendspace.
          </Text>
        </Box>

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>2. Akun Pengguna</Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>Pengguna wajib berusia minimal 17 tahun atau sudah memiliki KTP.</ListItem>
            <ListItem>Data yang dimasukkan saat pendaftaran (Nama, Email, No HP, Alamat) harus data yang valid dan benar.</ListItem>
            <ListItem>Lendspace berhak memblokir akun jika ditemukan indikasi penipuan atau pemalsuan data.</ListItem>
          </UnorderedList>
        </Box>

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>3. Transaksi Sewa & Pembayaran</Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              <strong>Sistem Deposit (DP):</strong> Penyewa wajib membayar uang muka (DP) sesuai persentase yang ditentukan 
              oleh Pemilik Barang (Lender) saat melakukan booking.
            </ListItem>
            <ListItem>
              <strong>Pelunasan:</strong> Sisa pembayaran wajib dilunasi saat Penyewa mengambil barang atau sesuai kesepakatan kedua belah pihak.
            </ListItem>
            <ListItem>
              <strong>Pembatalan:</strong> Jika Penyewa membatalkan sewa secara sepihak setelah DP dibayarkan, maka DP dianggap hangus 
              (kecuali ada kesepakatan lain dengan Pemilik Barang).
            </ListItem>
          </UnorderedList>
        </Box>

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>4. Tanggung Jawab Kerusakan & Kehilangan</Heading>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              Penyewa bertanggung jawab penuh atas keamanan barang selama masa sewa.
            </ListItem>
            <ListItem>
              Jika terjadi kerusakan atau kehilangan barang, Penyewa wajib mengganti kerugian sesuai dengan harga pasar barang tersebut 
              atau biaya perbaikan yang disepakati bersama Pemilik Barang.
            </ListItem>
            <ListItem>
              Lendspace hanya bertindak sebagai perantara (marketplace) dan tidak bertanggung jawab secara langsung atas kerusakan barang, 
              namun kami akan membantu proses mediasi.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>5. Perlindungan Data Pribadi (Sesuai UU PDP)</Heading>
          <Text align="justify" mb={2}>
            Kami sangat menghargai privasi Anda. Sesuai dengan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi:
          </Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>
              Kontak pribadi Anda (Nomor WhatsApp & Alamat) <strong>disembunyikan</strong> dan tidak akan ditampilkan ke publik.
            </ListItem>
            <ListItem>
              Kontak hanya akan dibuka kepada lawan transaksi Anda setelah status pesanan menjadi <strong>Dikonfirmasi (Confirmed)</strong>.
            </ListItem>
            <ListItem>
              Kami tidak akan menjual data pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box w="full">
          <Heading as="h2" size="md" mb={3}>6. Larangan</Heading>
          <Text>Pengguna dilarang keras menyewakan atau menggunakan platform untuk:</Text>
          <UnorderedList spacing={2} pl={4}>
            <ListItem>Barang ilegal, narkoba, senjata api, atau barang curian.</ListItem>
            <ListItem>Tindakan penipuan atau pencucian uang.</ListItem>
            <ListItem>Melakukan spamming di fitur Chat.</ListItem>
          </UnorderedList>
        </Box>

      </VStack>
    </Container>
  );
};

export default TermsPage;