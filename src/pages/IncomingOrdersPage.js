import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Box, Container, Heading, VStack, Text, Badge, Button, HStack, useToast, Image, Spinner
} from '@chakra-ui/react';

const IncomingOrdersPage = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Syntax '!inner' digunakan untuk filter tabel relasi (Produk milik user ini)
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        products!inner(*),
        profiles:user_id(full_name, phone) 
      `)
      .eq('products.lender_id', user.id) 
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setOrders(data || []);
    
    setLoading(false);
  };

  const updateStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast({ title: "Gagal update status", status: "error" });
    } else {
      toast({ title: `Pesanan ${newStatus}`, status: "success" });
      fetchOrders(); // Refresh data
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={6}>Pesanan Masuk (Barang Saya)</Heading>
      {orders.length === 0 ? (
        <Text>Belum ada yang menyewa barang Anda.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {orders.map((item) => (
            <Box key={item.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
              <HStack align="start" spacing={4}>
                <Image src={item.products.image_url} boxSize="80px" objectFit="cover" borderRadius="md" />
                <Box flex={1}>
                  <Text fontWeight="bold" fontSize="lg">{item.products.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Penyewa: <b>{item.profiles?.full_name}</b>
                  </Text>
                  <Text fontSize="sm">
                    Durasi: {item.total_days} Hari ({item.start_date} s/d {item.end_date})
                  </Text>
                  <Badge mt={2} colorScheme={item.status === 'confirmed' ? 'green' : item.status === 'cancelled' ? 'red' : 'yellow'}>
                    Status: {item.status}
                  </Badge>
                </Box>
              </HStack>
              
              {item.status === 'pending' && (
                <HStack mt={4} justify="end">
                  <Button colorScheme="red" variant="outline" size="sm" onClick={() => updateStatus(item.id, 'cancelled')}>Tolak</Button>
                  <Button colorScheme="green" size="sm" onClick={() => updateStatus(item.id, 'confirmed')}>Terima Sewa</Button>
                </HStack>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default IncomingOrdersPage;