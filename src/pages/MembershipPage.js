import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, SimpleGrid, Text, Button, VStack, 
  List, ListItem, ListIcon, Badge, useToast, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, Image, useDisclosure
} from '@chakra-ui/react';
import { CheckCircleIcon, StarIcon } from '@chakra-ui/icons';

const plans = [
  { id: 'monthly', name: 'Bulanan', price: 50000, duration: 30, tier: 'premium' },
  { id: 'yearly', name: 'Tahunan', price: 450000, duration: 365, tier: 'premium' },
  { id: 'lifetime', name: 'Lifetime VIP', price: 1500000, duration: 36500, tier: 'vip' }, // 100 tahun
];

const MembershipPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleBuy = (plan) => {
    if (!user) return navigate('/login');
    setSelectedPlan(plan);
    onOpen(); // Buka Modal QRIS
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      // Hitung tanggal kadaluarsa baru
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + selectedPlan.duration);

      // Update Profile User
      const { error } = await supabase
        .from('profiles')
        .update({
          membership_tier: selectedPlan.tier,
          membership_expiry: expiryDate,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: "Selamat! Anda sekarang Member.", status: "success" });
      onClose();
      navigate('/');
      
    } catch (error) {
      toast({ title: "Gagal upgrade", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={2} textAlign="center" mb={10}>
        <Heading fontSize="4xl">Upgrade Membership</Heading>
        <Text fontSize="lg" color="gray.500">
          Dapatkan diskon 10%, akses barang eksklusif, dan poin berlimpah.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {plans.map((plan) => (
          <Box 
            key={plan.id} 
            border="2px solid" 
            borderColor={plan.tier === 'vip' ? 'gold' : 'gray.200'} 
            p={6} 
            borderRadius="xl"
            shadow={plan.tier === 'vip' ? 'xl' : 'sm'}
            position="relative"
            bg="white"
          >
            {plan.tier === 'vip' && (
              <Badge position="absolute" top={-3} right={-3} colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">
                BEST VALUE
              </Badge>
            )}
            <Text fontWeight="bold" fontSize="2xl">{plan.name}</Text>
            <Text fontSize="3xl" fontWeight="800" mt={4}>
              Rp {plan.price.toLocaleString()}
            </Text>
            <Text color="gray.500" fontSize="sm" mb={6}>/ {plan.duration > 365 ? 'selamanya' : plan.duration + ' hari'}</Text>

            <List spacing={3} mb={6} textAlign="left">
              <ListItem><ListIcon as={CheckCircleIcon} color="green.500" /> Diskon Sewa 10%</ListItem>
              <ListItem><ListIcon as={CheckCircleIcon} color="green.500" /> Akses Barang Eksklusif</ListItem>
              <ListItem><ListIcon as={CheckCircleIcon} color="green.500" /> Akumulasi Poin</ListItem>
              {plan.tier === 'vip' && (
                 <ListItem><ListIcon as={StarIcon} color="orange.500" /> Prioritas Support</ListItem>
              )}
            </List>

            <Button 
              w="full" 
              colorScheme={plan.tier === 'vip' ? 'yellow' : 'blue'} 
              size="lg"
              onClick={() => handleBuy(plan)}
            >
              Pilih Paket
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {/* MODAL QRIS */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QRIS</ModalHeader>
          <ModalBody textAlign="center">
            <Text mb={4}>Total Bayar: <b>Rp {selectedPlan?.price.toLocaleString()}</b></Text>
            <Box p={4} border="1px solid gray" display="inline-block" borderRadius="md">
               <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" boxSize="150px" />
            </Box>
            <Text fontSize="xs" mt={2} color="gray.500">Simulasi Pembayaran</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={confirmPayment} colorScheme="green" isLoading={loading} w="full">
              Saya Sudah Bayar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default MembershipPage;