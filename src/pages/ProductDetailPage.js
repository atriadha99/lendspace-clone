import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Box, Container, Grid, Image, Heading, Text, VStack, HStack,
  Avatar, Divider, Button, Input, Stack,
  Alert, AlertIcon, Flex, useToast, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  Badge // Tambahan Badge
} from '@chakra-ui/react';
import { ChatIcon, CheckCircleIcon } from '@chakra-ui/icons';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Modal Control (Untuk Pop-up Pembayaran)
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State Data
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null); // State Membership
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  // State Form Booking
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // 1. FETCH DATA (Product & User Membership)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Ambil data Membership User (jika login)
        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('membership_tier, points')
            .eq('id', currentUser.id)
            .single();
          setMembership(profileData);
        }

        // Ambil Data Produk
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

  // 2. LOGIKA DISKON MEMBER
  // Cek apakah user member (Premium/VIP)
  const isMember = membership?.membership_tier === 'premium' || membership?.membership_tier === 'vip';
  const discount = isMember ? 0.10 : 0; // Diskon 10%
  // Harga per hari setelah diskon
  const finalPricePerDay = product ? product.price * (1 - discount) : 0;

  // 3. HITUNG TOTAL HARGA
  useEffect(() => {
    if (startDate && endDate && product) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
      
      setTotalDays(diffDays);
      // Gunakan harga diskon untuk perhitungan total
      setTotalPrice(diffDays * finalPricePerDay);
    }
  }, [startDate, endDate, product, finalPricePerDay]);

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

  const onBookingClick = () => {
    if (!user) return navigate('/login');
    onOpen(); // Buka Pop-up QRIS
  };

  // 4. PROSES PEMBAYARAN (SIMPAN DB + POIN + AUTO UPGRADE)
  const handlePaymentSuccess = async () => {
    setRenting(true);
    const depositPercent = product.deposit_percent || 30;
    const depositAmount = Math.round(totalPrice * depositPercent / 100);

    try {
      // A. Simpan Booking ke Supabase
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

      // B. LOGIKA TAMBAHAN: Update Poin & Cek Auto-Upgrade
      let newTier = membership?.membership_tier || 'regular';
      let expiry = new Date(); // default hari ini

      // Syarat Auto-Member: Harga > 2jt/hari AND Sewa >= 3 Hari
      if (product.price >= 2000000 && totalDays >= 3) {
         newTier = 'premium';
         expiry.setDate(expiry.getDate() + 30); // Bonus 30 hari
         toast({ 
           title: "🎉 BONUS UPGRADE!", 
           description: "Anda otomatis jadi Premium Member selama 30 hari!", 
           status: "info", 
           duration: 7000,
           isClosable: true
         });
      }

      // Hitung Poin (1 poin setiap Rp 10.000)
      const earnedPoints = Math.floor(totalPrice / 10000);

      // Update Profile User (Poin & Tier)
      await supabase.from('profiles').update({
        points: (membership?.points || 0) + earnedPoints,
        membership_tier: newTier === 'regular' ? (membership?.membership_tier || 'regular') : newTier,
        ...(newTier !== 'regular' && { membership_expiry: expiry })
      }).eq('id', user.id);

      // C. Selesai
      onClose();
      toast({ 
        title: "Pembayaran Berhasil!", 
        description: `Booking dikonfirmasi. Anda dapat +${earnedPoints} Poin!`, 
        status: "success", 
        duration: 5000 
      });
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

          {/* Harga & Diskon */}
          <Box>
            {isMember && (
              <Badge colorScheme="green" mb={1} fontSize="0.9em">
                Diskon Member 10%
              </Badge>
            )}
            <Text fontSize="2xl" color="red.500" fontWeight="bold">
              {isMember ? (
                 <>
                   <Text as="span" textDecoration="line-through" color="gray.400" fontSize="lg" mr={2}>
                     Rp {product.price.toLocaleString()}
                   </Text>
                   Rp {finalPricePerDay.toLocaleString()}/hari
                 </>
              ) : (
                 `Rp ${product.price.toLocaleString()}/hari`
              )}
            </Text>
          </Box>
          
          <HStack p={4} bg="gray.50" justify="space-between" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Flex align="center" gap={3}>
              <Avatar src={product.profiles?.avatar_url} name={product.profiles?.full_name} />
              <Text fontWeight="bold">{product.profiles?.full_name}</Text>
            </Flex>
            {!isOwnProduct && user && (
              <Button leftIcon={<ChatIcon />} size="sm" onClick={handleChat}>Chat</Button>
            )}
          </HStack>
          
          <Box>
            <Heading size="sm" mb={2}>Deskripsi</Heading>
            <Text color="gray.600" style={{ whiteSpace: 'pre-line' }}>{product.description}</Text>
          </Box>
        </VStack>

        {/* KOLOM KANAN (FORM BOOKING) */}
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
                
                {/* Info Poin */}
                <Flex justify="end" mt={1}>
                   <Badge colorScheme="purple">Potensi Poin: +{Math.floor(totalPrice / 10000)}</Badge>
                </Flex>

                <Divider my={3} borderColor="red.200" />
                <Flex justify="space-between" fontWeight="bold" color="red.600" fontSize="lg">
                  <Text>Bayar DP ({product.deposit_percent || 30}%)</Text>
                  <Text>Rp {depositVal.toLocaleString()}</Text>
                </Flex>
                <Text fontSize="xs" mt={2} color="gray.500">*Sisa Rp {(totalPrice - depositVal).toLocaleString()} dibayarkan saat ambil barang.</Text>
              </Box>
            )}

            {isOwnProduct ? (
              <Alert status="warning" borderRadius="md"><AlertIcon />Ini barang Anda sendiri.</Alert>
            ) : (
              <>
                <Button 
                  colorScheme="red" 
                  size="lg" 
                  onClick={onBookingClick} 
                  isDisabled={!totalDays}
                  width="full"
                >
                  Booking & Bayar DP
                </Button>
                
                <Button variant="outline" width="full" onClick={handleChat} leftIcon={<ChatIcon />}>
                  Tanya Ketersediaan
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Grid>

      {/* --- MODAL SIMULASI PEMBAYARAN QRIS --- */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pembayaran DP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="center" py={4}>
              <Text fontSize="sm" color="gray.500">Silakan scan QRIS di bawah ini</Text>
              
              <Box p={2} border="2px solid" borderColor="gray.200" borderRadius="lg">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                  boxSize="200px" 
                />
              </Box>

              <Text fontWeight="bold" fontSize="2xl" color="red.500">
                Rp {depositVal.toLocaleString()}
              </Text>
              
              <Alert status="info" fontSize="sm" borderRadius="md">
                <AlertIcon />
                Ini simulasi. Klik konfirmasi untuk proses otomatis.
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button 
              colorScheme="green" 
              onClick={handlePaymentSuccess} 
              isLoading={renting}
              leftIcon={<CheckCircleIcon />}
            >
              Saya Sudah Bayar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
};

export default ProductDetailPage;