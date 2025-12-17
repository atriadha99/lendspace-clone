import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading, VStack, Text, Badge, Image, Button, Spinner, useToast, SimpleGrid } from '@chakra-ui/react';

const MyRentalsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data } = await supabase
        .from('bookings')
        .select(`*, products (name, image_url)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setRentals(data || []);
      setLoading(false);
    };
    fetch();
  }, [navigate]);

  const handlePayRemaining = async (id) => {
    await supabase.from('bookings').update({ payment_status: 'paid', remaining_amount: 0 }).eq('id', id);
    toast({ title: "Lunas!", status: "success" });
    window.location.reload();
  };

  if (loading) return <Spinner />;

  return (
    <Container maxW="5xl" py={10}>
      <Heading mb={6}>Riwayat Sewa Saya</Heading>
      <VStack spacing={4} align="stretch">
        {rentals.map((item) => (
          <Box key={item.id} p={5} shadow="sm" borderWidth={1} borderRadius="xl">
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} alignItems="center">
              <Image src={item.products?.image_url} boxSize="80px" objectFit="cover" borderRadius="md" />
              <Box gridColumn={{ md: "span 2" }}>
                <Heading size="sm">{item.products?.name}</Heading>
                <Badge colorScheme={item.payment_status === 'paid' ? 'green' : 'orange'}>{item.payment_status}</Badge>
                <Text fontSize="sm">{item.total_days} Hari (Rp {item.total_price.toLocaleString()})</Text>
              </Box>
              <Box textAlign="right">
                {item.payment_status === 'partial' ? (
                   <Button size="sm" colorScheme="red" onClick={() => handlePayRemaining(item.id)}>Bayar Sisa: Rp {item.remaining_amount.toLocaleString()}</Button>
                ) : (
                   <Text color="green.500" fontWeight="bold">Lunas</Text>
                )}
              </Box>
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};
export default MyRentalsPage;