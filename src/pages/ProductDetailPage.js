// src/pages/ProductDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import { AuthContext } from '../context/AuthContext'; // 1. IMPORT AUTH CONTEXT

import {
  Box, Container, Stack, Text, Image, Flex, VStack, Button, Heading,
  SimpleGrid, StackDivider, useColorModeValue, List, ListItem, Input,
  FormControl, FormLabel, Avatar, Badge, useToast
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// --- DATA DUMMY (FALLBACK) ---
const DUMMY_DETAILS = {
  id: 1,
  name: 'Kamera Canon EOS R5 (Demo)',
  price: 500000,
  description: 'Kamera mirrorless profesional (Data Dummy).',
  image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  category: 'Photography',
  rating: 4.8,
  lender: { name: 'Budi Kamera', avatar: '', location: 'Jakarta' },
  features: ['Video 8K', 'Full-frame']
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // 2. AMBIL DATA USER DARI CONTEXT
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false); // State loading saat klik sewa
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const colorText = useColorModeValue('gray.900', 'gray.400');
  const bgBox = useColorModeValue('white', 'gray.900');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');
  const yellowColor = useColorModeValue('yellow.500', 'yellow.300');
  const lenderBg = useColorModeValue('gray.50', 'gray.700');
  const descColor = useColorModeValue('gray.500', 'gray.400');

  // --- FETCH PRODUCT ---
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) throw new Error("Data tidak ditemukan");
        
        setProduct({
          ...data,
          lender: { name: data.lender_name || "Lender", location: "Jakarta" },
          features: ["Kondisi Bagus", "Fungsi Normal", "Siap Pakai"] 
        });

      } catch (err) {
        console.warn("Menggunakan data dummy.");
        setProduct({ ...DUMMY_DETAILS, id: id });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // --- HITUNG HARGA ---
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      const days = diffDays === 0 ? 1 : diffDays;
      
      setTotalDays(days);
      if (product) setTotalPrice(days * product.price);
    }
  }, [startDate, endDate, product]);

  // --- 3. FUNGSI SEWA REAL (CONNECT DATABASE) ---
  const handleRent = async () => {
    // Validasi Tanggal
    if (!startDate || !endDate) {
      toast({ title: "Pilih Tanggal", status: "warning", duration: 3000 });
      return;
    }

    // Validasi Login
    if (!user) {
      toast({ 
        title: "Login Diperlukan", 
        description: "Silakan login untuk menyewa barang.", 
        status: "error", 
        duration: 3000 
      });
      navigate('/login');
      return;
    }

    setRenting(true);

    try {
      // A. Masukkan Data ke Tabel Bookings
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,          // Siapa yang sewa
            product_id: product.id,    // Barang apa (ID harus valid di DB)
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
            payment_status: 'success', // Simulasi langsung lunas
            status: 'active'
          }
        ]);

      if (error) throw error;

      // B. Sukses! Arahkan ke halaman sukses
      navigate('/payment-success', {
        state: {
          title: "Booking Berhasil Disimpan! 🚀",
          message: `Terima kasih ${user.user_metadata?.full_name || 'Kak'}. Data sewa ${product.name} telah tersimpan di sistem kami.`
        }
      });

    } catch (error) {
      console.error(error);
      // Fallback: Jika error (misal karena produk dummy ID-nya ga ada di DB), tetap tampilkan sukses simulasi
      if (product.id === 1 && product.name.includes("Demo")) {
         toast({ title: "Mode Demo", description: "Booking simulasi berhasil (Data Dummy).", status: "info" });
         navigate('/payment-success', { state: { title: "Demo Sukses", message: "Ini hanya simulasi barang dummy." }});
      } else {
         toast({ title: "Gagal Booking", description: error.message, status: "error" });
      }
    } finally {
      setRenting(false);
    }
  };

  if (loading || !product) {
    return <Container py={20}><Text align="center">Memuat produk...</Text></Container>;
  }

  return (
    <Container maxW={'container.xl'} py={10}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 18, md: 24 }}>
        
        {/* GAMBAR */}
        <Flex>
          <Image rounded={'md'} alt={product.name} src={product.image_url} fit={'cover'} align={'center'} w={'100%'} h={{ base: '100%', sm: '400px', lg: '500px' }} boxShadow="lg" />
        </Flex>

        {/* DETAIL */}
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {product.name}
            </Heading>
            <Text color={colorText} fontWeight={300} fontSize={'2xl'}>
              Rp {product.price.toLocaleString('id-ID')} / hari
            </Text>
            <Flex alignItems="center" mt={2}>
               <Badge colorScheme="green" mr={2}>{product.category}</Badge>
               <StarIcon color="yellow.400" />
               <Text ml={1} fontWeight="bold">{product.rating}</Text>
            </Flex>
          </Box>

          <Stack spacing={{ base: 4, sm: 6 }} direction={'column'} divider={<StackDivider borderColor={dividerColor} />}>
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize={'lg'} color={descColor}>{product.description}</Text>
            </VStack>
            <Box>
              <Text fontSize={{ base: '16px', lg: '18px' }} color={yellowColor} fontWeight={'500'} textTransform={'uppercase'} mb={'4'}>
                Kelengkapan & Fitur
              </Text>
              <List spacing={2}>
                {product.features?.map((feature, index) => (
                  <ListItem key={index}><Text as={'span'} fontWeight={'bold'}>•</Text> {feature}</ListItem>
                ))}
              </List>
            </Box>
            <Box bg={lenderBg} p={4} borderRadius="md">
               <Flex align="center">
                 <Avatar src={product.lender.avatar} name={product.lender.name} mr={4} />
                 <Box>
                   <Text fontWeight="bold">Pemilik: {product.lender.name}</Text>
                   <Text fontSize="sm">{product.lender.location}</Text>
                 </Box>
               </Flex>
            </Box>
          </Stack>

          {/* FORM BOOKING */}
          <Box p={6} bg={bgBox} border="1px solid" borderColor="gray.200" borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>Atur Jadwal Sewa</Heading>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={4}>
              <FormControl>
                <FormLabel>Tanggal Mulai</FormLabel>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Tanggal Selesai</FormLabel>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
            </Stack>

            {totalDays > 0 && (
              <Flex justify="space-between" align="center" mb={4} p={3} bg="green.50" borderRadius="md">
                <Text fontWeight="bold" color="green.700">Total {totalDays} Hari</Text>
                <Text fontWeight="bold" fontSize="xl" color="green.700">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </Text>
              </Flex>
            )}

            <Button
              rounded={'none'} w={'full'} mt={2} size={'lg'} py={'7'}
              bg={'red.500'} color={'white'} textTransform={'uppercase'}
              _hover={{ transform: 'translateY(2px)', boxShadow: 'lg', bg: 'red.600' }}
              onClick={handleRent}
              isLoading={renting} // Tampilkan spinner saat proses insert DB
              loadingText="Memproses Booking..."
            >
              Sewa Sekarang
            </Button>
          </Box>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}