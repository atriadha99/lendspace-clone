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

        // NOTE: Pastikan di DB kolomnya 'lender_id' atau 'user_id'. Sesuaikan di sini.
        // Asumsi standar: lender_id
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
        deposit_paid: true, // Simulasi bayar DP sukses
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

  if (loading) return <Flex justify="center" h="100vh"><Spinner /></Flex>;
  if (!product) return <Box p={10}>Produk tidak ditemukan</Box>;

  const isOwnProduct = user && product.lender_id === user.id;
  const depositVal = Math.round(totalPrice * (product.deposit_percent || 30) / 100);

  return (
    <Container maxW="7xl" py={10}>
      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
        <VStack align="stretch" spacing={6}>
          <Image src={product.image_url} h="400px" objectFit="cover" borderRadius="xl" />
          <Heading>{product.name}</Heading>
          <Text fontSize="2xl" color="blue.600">Rp {product.price.toLocaleString()}/hari</Text>
          
          <HStack p={4} bg="gray.50" justify="space-between" borderRadius="lg">
            <Flex align="center" gap={3}>
              <Avatar src={product.profiles?.avatar_url} />
              <Text fontWeight="bold">{product.profiles?.full_name}</Text>
            </Flex>
            {!isOwnProduct && user && (
              <Button leftIcon={<ChatIcon />} onClick={() => navigate(`/chat/${product.lender_id}`)}>Chat</Button>
            )}
          </HStack>
          <Text>{product.description}</Text>
        </VStack>

        <Box p={6} bg="white" shadow="lg" borderRadius="xl" h="fit-content">
          <Heading size="md" mb={4}>Sewa Barang</Heading>
          <Stack spacing={4}>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            
            {totalDays > 0 && (
              <Box bg="gray.50" p={4} borderRadius="md">
                <Flex justify="space-between"><Text>Total Sewa</Text><Text>Rp {totalPrice.toLocaleString()}</Text></Flex>
                <Divider my={2} />
                <Flex justify="space-between" fontWeight="bold" color="green.600">
                  <Text>Bayar DP ({product.deposit_percent || 30}%)</Text>
                  <Text>Rp {depositVal.toLocaleString()}</Text>
                </Flex>
                <Text fontSize="xs" mt={2}>Sisa Rp {(totalPrice - depositVal).toLocaleString()} dibayar nanti.</Text>
              </Box>
            )}

            {isOwnProduct ? (
              <Alert status="warning"><AlertIcon />Barang milik sendiri</Alert>
            ) : (
              <Button colorScheme="red" onClick={handleRent} isLoading={renting} isDisabled={!totalDays}>Booking & Bayar DP</Button>
            )}
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
};
export default ProductDetailPage;