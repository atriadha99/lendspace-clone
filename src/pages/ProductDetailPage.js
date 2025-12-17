import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Box, Container, Grid, Image, Heading, Text, VStack, HStack,
  Avatar, Divider, Button, Input, Stack,
  Alert, AlertIcon, Flex, useToast, Spinner
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  // State Form Booking
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        const { data, error } = await supabase
          .from('products')
          .select(`*, profiles:lender_id (id, full_name, avatar_url)`)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        toast({ title: "Error", description: err.message, status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  useEffect(() => {
    if (startDate && endDate && product) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
      setTotalDays(diffDays);
      setTotalPrice(diffDays * product.price);
    }
  }, [startDate, endDate, product]);

  const handleChat = () => {
    navigate(`/chat/${product.lender_id}`, {
      state: { 
        productContext: {
          name: product.name,
          image: product.image_url,
          price: product.price
        } 
      }
    });
  };

  const handleRent = async () => {
    if (!user) return navigate('/login');
    
    setRenting(true);
    const depositPercent = product.deposit_percent || 30;
    const depositAmount = Math.round(totalPrice * depositPercent / 100);

    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        product_id: product.id,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        total_price: totalPrice,
        deposit_amount: depositAmount,
        deposit_paid: true, 
        remaining_amount: totalPrice - depositAmount,
        status: 'confirmed',
        payment_status: 'partial'
      });

      if (error) throw error;
      toast({ title: "Booking Berhasil!", status: "success" });
      navigate('/my-rentals');
    } catch (err) {
      toast({ title: "Gagal", description: err.message, status: "error" });
    } finally {
      setRenting(false);
    }
  };

  if (loading) return <Flex justify="center" h="100vh" align="center"><Spinner size="xl" /></Flex>;
  if (!product) return <Box p={10}>Produk tidak ditemukan</Box>;

  const isOwnProduct = user && product.lender_id === user.id;
  const depositVal = Math.round(totalPrice * (product.deposit_percent || 30) / 100);

  return (
    <Container maxW="7xl" py={10}>
      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
        
        {/* KOLOM KIRI */}
        <VStack align="stretch" spacing={6}>
          <Image src={product.image_url} h="400px" objectFit="cover" borderRadius="xl" />
          <Heading>{product.name}</Heading>
          <Text fontSize="2xl" color="red.500" fontWeight="bold">
            Rp {product.price.toLocaleString()}/hari
          </Text>
          
          <HStack p={4} bg="gray.50" justify="space-between" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Flex align="center" gap={3}>
              <Avatar src={product.profiles?.avatar_url} name={product.profiles?.full_name} />
              <Text fontWeight="bold">{product.profiles?.full_name}</Text>
            </Flex>
            {!isOwnProduct && user && (
              <Button leftIcon={<ChatIcon />} size="sm" onClick={handleChat}>
                Chat
              </Button>
            )}
          </HStack>
          
          <Box>
            <Heading size="sm" mb={2}>Deskripsi</Heading>
            <Text color="gray.600" style={{ whiteSpace: 'pre-line' }}>{product.description}</Text>
          </Box>
        </VStack>

        {/* KOLOM KANAN */}
        <Box p={6} bg="white" shadow="xl" borderRadius="xl" h="fit-content" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={4}>Atur Jadwal Sewa</Heading>
          <Stack spacing={4}>
            <Box>
              <Text fontSize="sm" mb={1} fontWeight="bold">Mulai Sewa</Text>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1} fontWeight="bold">Selesai Sewa</Text>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Box>
            
            {totalDays > 0 && (
              <Box bg="red.50" p={4} borderRadius="md" border="1px dashed" borderColor="red.300">
                <Flex justify="space-between"><Text>Durasi</Text><Text fontWeight="bold">{totalDays} Hari</Text></Flex>
                <Flex justify="space-between" mt={1}><Text>Total Harga</Text><Text fontWeight="bold">Rp {totalPrice.toLocaleString()}</Text></Flex>
                <Divider my={3} borderColor="red.200" />
                <Flex justify="space-between" fontWeight="bold" color="red.600" fontSize="lg">
                  <Text>Bayar DP ({product.deposit_percent || 30}%)</Text>
                  <Text>Rp {depositVal.toLocaleString()}</Text>
                </Flex>
                <Text fontSize="xs" mt={2} color="gray.500">
                  *Sisa Rp {(totalPrice - depositVal).toLocaleString()} dibayarkan saat ambil barang.
                </Text>
              </Box>
            )}

            {isOwnProduct ? (
              <Alert status="warning" borderRadius="md"><AlertIcon />Ini barang Anda sendiri.</Alert>
            ) : (
              /* --- BAGIAN YANG DIPERBAIKI (DIBUNGKUS <>) --- */
              <>
                <Button 
                  colorScheme="red" 
                  size="lg" 
                  onClick={handleRent} 
                  isLoading={renting} 
                  isDisabled={!totalDays}
                  width="full"
                >
                  Booking & Bayar DP
                </Button>
                
                <Button variant="outline" width="full" onClick={handleChat} leftIcon={<ChatIcon />}>
                  Tanya Ketersediaan
                </Button>
              </>
              /* --------------------------------------------- */
            )}
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;