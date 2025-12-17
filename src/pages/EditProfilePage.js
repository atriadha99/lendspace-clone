import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, FormControl, FormLabel, Input, Button, useToast, VStack, Avatar, Center, Spinner, Flex,
  useColorModeValue // <--- Import ini
} from '@chakra-ui/react';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Variabel Warna Dinamis
  const bgForm = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setAvatarUrl(data.avatar_url);
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: "Profil diperbarui!", status: "success" });
      navigate('/'); 
    } catch (error) {
      toast({ title: "Gagal update", description: error.message, status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.sm" py={10}>
      {/* Pasang variabel warna di sini */}
      <Box p={8} bg={bgForm} color={textColor} shadow="lg" borderRadius="xl">
        <Heading mb={6}>Edit Profil</Heading>
        <VStack spacing={4} align="stretch">
          <Center>
            <Avatar size="xl" src={avatarUrl} name={fullName} mb={4} />
          </Center>

          <FormControl>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Nama Lengkap Anda"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Nomor WhatsApp</FormLabel>
            <Input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="08xxxxxxxx"
              type="tel"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Alamat</FormLabel>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Alamat domisili"
            />
          </FormControl>

          <Button colorScheme="red" onClick={handleUpdate} isLoading={updating}>
            Simpan Perubahan
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default EditProfilePage;