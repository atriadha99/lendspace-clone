import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Sesuaikan path ini dengan struktur folder Anda
import { supabase } from '../lib/supabaseClient'; 
import {
  Box, Container, Grid, Image, Heading, Text, Badge, VStack, HStack,
  Avatar, Divider, Button, Input, FormControl, FormLabel, Stack,
  Alert, AlertIcon, Flex, useToast, Spinner
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons'; // Pastikan sudah install: npm i @chakra-ui/icons

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // State Data
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Form Sewa
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [renting, setRenting] = useState(false);

  // Colors
  const bgBox = "white"; 

  // 1. Fetch Data Produk & User
  useEffect(() => {
    const fetchProductAndUser = async () => {
      try {
        setLoading(true);
        
        // Cek User Login
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
  
        // Ambil Detail Produk + Data Pemilik (Lender)
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles:lender_id (id, full_name, avatar_url, phone)
          `)
          .eq('id', id)
          .single();
  
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Gagal memuat produk",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndUser();
  }, [id, toast]);

  // 2. Hitung total hari & harga realtime
  useEffect(() => {
    if (startDate && endDate && product) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      // Jika tanggal sama, hitung 1 hari
      const days = diffDays === 0 ? 1 : diffDays;
      
      setTotalDays(days);
      setTotalPrice(days * product.price);
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, product]);

  // 3. Logic Booking (Sewa)
  const handleRent = async () => {
    if (!startDate || !endDate || !product) return;

    if (!user) {
        toast({ title: "Login diperlukan", status: "error" });
        navigate('/login');
        return;
    }

    // Logic perhitungan DP
    const depositPercent = product.deposit_percent || 30; // Default 30% jika null
    const depositAmount = Math.round(totalPrice * depositPercent / 100);

    setRenting(true);
    try {
        const { error } = await supabase
        .from('bookings')
        .insert({
            user_id: user.id,
            product_id: product.id,
            start_date: startDate,
            end_date: endDate,
            total_days: totalDays,
            total_price: totalPrice,
            deposit_amount: depositAmount,
            deposit_paid: true,                   // Anggap user bayar DP via gateway (simulasi)
            remaining_amount: totalPrice - depositAmount,
            status: 'confirmed',
            payment_status: 'partial',            // Status: sudah DP
        });

        if (error) throw error;

        toast({
            title: "Booking Berhasil!",
            description: `DP Rp ${depositAmount.toLocaleString('id-ID')} berhasil dicatat.`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Arahkan ke halaman riwayat sewa (pastikan route ini ada)
        navigate('/my-rentals'); 
    } catch (err) {
        toast({ title: "Gagal booking", description: err.message, status: "error" });
    } finally {
        setRenting(false);
    }
  };

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" /></Flex>;
  if (!product) return <Box p={10} textAlign="center">Produk tidak ditemukan</Box>;

  // Cek kepemilikan
  const isOwnProduct = user && product.lender_id === user.id;

  return (
    <Container maxW="7xl" py={10}>
      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
        
        {/* KOLOM KIRI: INFO PRODUK */}
        <VStack align="stretch" spacing={6}>
          <Box borderRadius="xl" overflow="hidden" boxShadow="md">
            <Image 
              src={product.image_url || "https://via.placeholder.com/800"} 
              w="full" h="400px" objectFit="cover" 
            />
          </Box>
          <Box>
            <HStack spacing={2} mb={2}>
              <Badge colorScheme={product.status === 'available' ? 'green' : 'red'}>
                {product.status}
              </Badge>
              <Badge colorScheme="purple">{product.category}</Badge>
            </HStack>
            <Heading size="xl" mb={2}>{product.name}</Heading>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Rp {Number(product.price).toLocaleString('id-ID')} / hari
            </Text>
          </Box>

          {/* AREA INFO PEMILIK & TOMBOL CHAT */}
          <HStack spacing={4} p={4} borderWidth={1} borderRadius="lg" bg="gray.50" justify="space-between">
            <Flex align="center" gap={3}>
                <Avatar src={product.profiles?.avatar_url} name={product.profiles?.full_name} />
                <Box>
                <Text fontSize="sm" color="gray.500">Pemilik Barang</Text>
                <Text fontWeight="bold">{product.profiles?.full_name || 'Lendspace User'}</Text>
                </Box>
            </Flex>

            {/* Tombol Chat (Hanya muncul jika bukan barang sendiri & sudah login) */}
            {!isOwnProduct && user && (
                <Button 
                    size="sm" 
                    colorScheme="teal" 
                    leftIcon={<ChatIcon />}
                    onClick={() => navigate(`/chat/${product.lender_id}`)}
                >
                    Chat
                </Button>
            )}
          </HStack>

          <Box>
            <Heading size="md" mb={2}>Deskripsi</Heading>
            <Text color="gray.600" whiteSpace="pre-line">{product.description}</Text>
          </Box>
        </VStack>

        {/* KOLOM KANAN: FORM SEWA */}
        <Box>
          <Box p={6} bg={bgBox} rounded="xl" shadow="lg" borderWidth={1} position="sticky" top="20px">
            <Heading size="lg" mb={6}>Pilih Tanggal Sewa</Heading>
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Tanggal Mulai</FormLabel>
                <Input type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tanggal Selesai</FormLabel>
                <Input type="date" min={startDate || new Date().toISOString().split('T')[0]} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>

              {totalDays > 0 && (
                <>
                  <Box p={4} bg="gray.50" _dark={{ bg: "gray.700" }} borderRadius="lg">
                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between">
                        <Text>Sewa {totalDays} hari × Rp {Number(product.price).toLocaleString('id-ID')}</Text>
                        <Text fontWeight="bold">Rp {totalPrice.toLocaleString('id-ID')}</Text>
                      </Flex>
                      
                      {/* Tampilkan DP */}
                      {(product.deposit_percent || 0) > 0 && (
                        <>
                          <Divider />
                          <Flex justify="space-between" color="blue.600" fontWeight="bold">
                            <Text>Uang Muka (DP {product.deposit_percent}%)</Text>
                            <Text>Rp {Math.round(totalPrice * (product.deposit_percent || 0) / 100).toLocaleString('id-ID')}</Text>
                          </Flex>
                        </>
                      )}
                      
                      <Divider />
                      <Flex justify="space-between" fontSize="lg" fontWeight="extrabold" color="green.600">
                        <Text>Bayar Sekarang</Text>
                        <Text>Rp {Math.round(totalPrice * (product.deposit_percent || 30) / 100).toLocaleString('id-ID')}</Text>
                      </Flex>

                      {/* Info Sisa Bayar */}
                      {(product.deposit_percent || 0) < 100 && (
                        <Alert status="info" variant="left-accent" fontSize="sm" mt={2}>
                          <AlertIcon />
                          Sisa Rp {Math.round(totalPrice * (100 - (product.deposit_percent || 0)) / 100).toLocaleString('id-ID')} dibayar saat ambil barang
                        </Alert>
                      )}
                    </VStack>
                  </Box>

                  {isOwnProduct ? (
                    <Alert status="error" borderRadius="lg"><AlertIcon />Ini barang milikmu.</Alert>
                  ) : (
                    <Button 
                        size="lg" 
                        colorScheme="red" 
                        w="full" 
                        h="60px" 
                        fontSize="xl" 
                        isLoading={renting} 
                        loadingText="Memproses..." 
                        onClick={handleRent} 
                        isDisabled={!startDate || !endDate}
                    >
                      Bayar DP & Booking
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;