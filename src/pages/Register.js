// src/pages/Register.js
import React, { useState, useContext } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Avatar,
  VStack,
  HStack
} from '@chakra-ui/react';
// PERBAIKAN DI SINI: Ganti UploadIcon jadi AttachmentIcon
import { PhoneIcon, AttachmentIcon } from '@chakra-ui/icons'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const bgBox = useColorModeValue('white', 'gray.700');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password || !form.phone) {
      toast({
        title: "Data belum lengkap",
        description: "Nama, email, password, dan nomor HP wajib diisi",
        status: "warning",
        duration: 4000,
        isClosable: true
      });
      return;
    }

    if (form.password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Minimal 6 karakter",
        status: "warning"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await register(
        form.email,
        form.password,
        form.fullName
      );

      if (authError) throw authError;
      const user = authData?.user;

      let avatarUrl = null;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim() || null,
          avatar_url: avatarUrl,
          balance: 0,
          ktp_verified: false,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      toast({
        title: "Registrasi berhasil!",
        description: "Akun telah dibuat. Silakan login.",
        status: "success",
        duration: 5000,
        isClosable: true
      });

      navigate('/login');

    } catch (error) {
      let msg = error.message;
      if (error.message.includes('duplicate')) msg = "Email atau nomor HP sudah terdaftar";
      toast({ title: "Registrasi gagal", description: msg, status: "error", duration: 6000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Stack spacing={8} mx="auto" maxW="lg" w="full" py={12} px={6}>
        <VStack spacing={2} textAlign="center">
          <Heading fontSize="4xl">Daftar Akun Baru</Heading>
          <Text fontSize="lg" color="gray.600">Mulai sewakan barangmu atau sewa barang orang lain</Text>
        </VStack>

        <Box rounded="2xl" bg={bgBox} boxShadow="2xl" p={8}>
          <Stack spacing={6} as="form" onSubmit={handleRegister}>
            <VStack spacing={4}>
              <Avatar size="xl" name={form.fullName} src={avatarFile ? URL.createObjectURL(avatarFile) : undefined} bg="red.500" color="white" />
              <Button as="label" htmlFor="avatar-input" leftIcon={<AttachmentIcon />} variant="outline" size="sm" cursor="pointer">
                Pilih Foto Profil (Opsional)
              </Button>
              <Input id="avatar-input" type="file" accept="image/*" display="none" onChange={(e) => setAvatarFile(e.target.files[0] || null)} />
            </VStack>

            <FormControl isRequired>
              <FormLabel>Nama Lengkap</FormLabel>
              <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Masukkan nama lengkap" focusBorderColor="red.400" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contoh@gmail.com" focusBorderColor="red.400" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter" focusBorderColor="red.400" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Nomor HP (WhatsApp)</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<PhoneIcon color="gray.500" />} />
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="81234567890" type="tel" focusBorderColor="red.400" />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Alamat Lengkap</FormLabel>
              <Textarea name="address" value={form.address} onChange={handleChange} placeholder="Jalan, kota, kecamatan..." resize="none" focusBorderColor="red.400" />
            </FormControl>

            <Button type="submit" bg="red.500" color="white" size="lg" isLoading={loading} loadingText="Membuat akun..." _hover={{ bg: 'red.600' }}>
              Daftar Sekarang
            </Button>

            <HStack justify="center">
              <Text color="gray.600">Sudah punya akun?</Text>
              <Button variant="link" color="red.500" onClick={() => navigate('/login')}>Login di sini</Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}