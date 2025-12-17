import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Button,
  Spinner,
  Flex,
  useToast,
  Avatar,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

const MyLendingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 🔥 FIX ESLINT: bungkus pakai useCallback
  const fetchIncomingOrders = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products!inner (
            id, name, image_url, price, lender_id
          ),
          profiles:user_id (
            id, full_name, avatar_url, phone, address
          )
        `)
        .eq('products.lender_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIncomingOrders(data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Gagal memuat pesanan masuk',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  // 🔥 Dependency sekarang valid
  useEffect(() => {
    fetchIncomingOrders();
  }, [fetchIncomingOrders]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setProcessingId(bookingId);

      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title:
          newStatus === 'confirmed'
            ? 'Pesanan Diterima'
            : 'Pesanan Ditolak',
        status: newStatus === 'confirmed' ? 'success' : 'warning',
      });

      fetchIncomingOrders();
    } catch (error) {
      toast({
        title: 'Gagal update status',
        description: error.message,
        status: 'error',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Container maxW="5xl" py={10}>
      <Heading mb={6}>Pesanan Masuk (Barang Saya)</Heading>

      {incomingOrders.length === 0 ? (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="xl">
          <Text fontSize="lg" color="gray.500">
            Belum ada yang menyewa barang Anda.
          </Text>
        </Box>
      ) : (
        <VStack spacing={5} align="stretch">
          {incomingOrders.map((booking) => {
            const canViewPrivateData =
              booking.status === 'confirmed' ||
              booking.payment_status === 'paid';

            return (
              <Box
                key={booking.id}
                p={5}
                bg="white"
                borderWidth={1}
                borderRadius="xl"
                shadow="sm"
                borderColor={
                  booking.status === 'confirmed'
                    ? 'green.200'
                    : 'gray.200'
                }
              >
                <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                  {/* INFO PRODUK */}
                  <HStack align="start" spacing={4} flex={1}>
                    <Image
                      src={booking.products?.image_url}
                      borderRadius="md"
                      boxSize="80px"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Produk Sewaan
                      </Text>
                      <Heading size="sm">
                        {booking.products?.name}
                      </Heading>
                      <Badge
                        mt={1}
                        colorScheme={
                          booking.status === 'confirmed'
                            ? 'green'
                            : booking.status === 'cancelled'
                            ? 'red'
                            : 'yellow'
                        }
                      >
                        Status: {booking.status}
                      </Badge>
                      <Text fontSize="sm" mt={1}>
                        {new Date(
                          booking.start_date
                        ).toLocaleDateString('id-ID')}{' '}
                        -{' '}
                        {new Date(
                          booking.end_date
                        ).toLocaleDateString('id-ID')}
                      </Text>
                    </Box>
                  </HStack>

                  {/* INFO PENYEWA */}
                  <Box flex={1} bg="gray.50" p={3} borderRadius="lg">
                    <Flex align="center" gap={3}>
                      <Avatar
                        size="sm"
                        src={booking.profiles?.avatar_url}
                      />
                      <Box>
                        <Text fontSize="xs" color="gray.500">
                          Penyewa
                        </Text>
                        <Text fontWeight="bold">
                          {booking.profiles?.full_name}
                        </Text>
                      </Box>
                    </Flex>

                    <Divider my={2} />

                    {canViewPrivateData ? (
                      <VStack align="start" spacing={1} fontSize="sm">
                        <Text>📞 {booking.profiles?.phone || '-'}</Text>
                        <Text>🏠 {booking.profiles?.address || '-'}</Text>
                        <Button
                          size="xs"
                          leftIcon={<ChatIcon />}
                          variant="link"
                          colorScheme="teal"
                          onClick={() =>
                            navigate(`/chat/${booking.user_id}`)
                          }
                        >
                          Chat Penyewa
                        </Button>
                      </VStack>
                    ) : (
                      <Alert status="info" fontSize="xs">
                        <AlertIcon boxSize="12px" />
                        Kontak penyewa disembunyikan sampai pesanan
                        diterima.
                      </Alert>
                    )}
                  </Box>

                  {/* AKSI */}
                  <VStack flex={1} align="stretch">
                    <Text fontSize="xs" color="gray.500">
                      Potensi Pendapatan
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="green.600">
                      Rp{' '}
                      {booking.total_price.toLocaleString('id-ID')}
                    </Text>

                    {booking.status !== 'confirmed' && (
                      <HStack>
                        <Button
                          flex={1}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          isLoading={processingId === booking.id}
                          onClick={() =>
                            handleUpdateStatus(
                              booking.id,
                              'cancelled'
                            )
                          }
                        >
                          Tolak
                        </Button>
                        <Button
                          flex={1}
                          size="sm"
                          colorScheme="blue"
                          isLoading={processingId === booking.id}
                          onClick={() =>
                            handleUpdateStatus(
                              booking.id,
                              'confirmed'
                            )
                          }
                        >
                          Terima
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}
    </Container>
  );
};

export default MyLendingsPage;
