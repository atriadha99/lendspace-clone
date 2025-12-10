import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Sesuaikan path
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, VStack, Heading, FormControl, FormLabel, Input, 
  Button, Avatar, useToast, Textarea, Center, InputGroup, InputLeftAddon
} from '@chakra-ui/react';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [session, setSession] = useState(null);

  // State Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Ambil Data User Saat Ini (Fetch)
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }
        setSession(user);

        // Ambil data dari tabel profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, address, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  // 2. Fungsi Upload Foto Profil
  const uploadAvatar = async (event) => {
    try {
      setUploadingImage(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Pilih gambar terlebih dahulu.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload ke bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl); // Update preview di layar
      toast({ title: "Foto berhasil diupload!", status: "success" });

    } catch (error) {
      toast({ title: "Gagal upload foto", description: error.message, status: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  // 3. Fungsi Simpan Perubahan (Update Database)
  const updateProfile = async () => {
    try {
      setUpdating(true);

      const updates = {
        id: session.id, // ID User sebagai kunci update
        full_name: fullName,
        phone: phone,
        address: address,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      toast({ title: "Profil berhasil diperbarui!", status: "success" });
      navigate('/'); // Kembali ke Home atau Halaman Profil

    } catch (error) {
      toast({ title: "Gagal update profil", description: error.message, status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box bg="white" p={8} shadow="lg" borderRadius="xl">
        <Heading mb={6} textAlign="center">Edit Profil</Heading>

        <VStack spacing={5}>
          {/* Avatar Section */}
          <Center flexDirection="column">
            <Avatar size="2xl" src={avatarUrl} mb={4} name={fullName} />
            <FormLabel
              htmlFor="avatar-upload"
              cursor="pointer"
              bg="gray.100"
              px={4}
              py={2}
              borderRadius="md"
              _hover={{ bg: "gray.200" }}
            >
              {uploadingImage ? 'Mengupload...' : 'Ganti Foto'}
            </FormLabel>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              display="none"
            />
          </Center>

          {/* Form Fields */}
          <FormControl>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Nama Anda"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Nomor WhatsApp</FormLabel>
            <InputGroup>
              <InputLeftAddon children="+62" />
              <Input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="8123456789"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Alamat Lengkap</FormLabel>
            <Textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Jalan, Kota, Kode Pos"
            />
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            size="lg"
            onClick={updateProfile}
            isLoading={updating || uploadingImage}
            loadingText="Menyimpan..."
            mt={4}
          >
            Simpan Perubahan
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default EditProfilePage;