import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  useToast,
  InputGroup,
  InputLeftAddon,
  Center,
  Avatar,
  Checkbox,
  Link as ChakraLink,
} from '@chakra-ui/react';

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // VALIDASI
    if (!email || !password || !fullName || !phone) {
      toast({
        title: 'Data belum lengkap',
        description: 'Mohon lengkapi semua field wajib (*)',
        status: 'warning',
      });
      return;
    }

    if (!agreed) {
      toast({
        title: 'Persetujuan diperlukan',
        description: 'Anda harus menyetujui Syarat & Ketentuan.',
        status: 'warning',
      });
      return;
    }

    try {
      setLoading(true);

      // 🔐 SIGN UP (TANPA INSERT PROFILE)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            address,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Registrasi Berhasil 🎉',
        description: 'Silakan cek email untuk verifikasi akun Anda.',
        status: 'success',
        duration: 5000,
      });

      navigate('/login');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Registrasi Gagal',
        description: error.message || 'Terjadi kesalahan.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        bg="white"
        shadow="xl"
        borderRadius="xl"
        border="1px"
        borderColor="gray.200"
      >
        <Heading mb={6} textAlign="center">
          Daftar Akun Baru
        </Heading>

        <VStack spacing={4} align="stretch">
          {/* AVATAR (DISPLAY ONLY) */}
          <Center flexDirection="column">
            <Avatar
              size="xl"
              src={avatarFile ? URL.createObjectURL(avatarFile) : undefined}
              mb={3}
            />
            <FormLabel
              htmlFor="avatar-upload"
              cursor="pointer"
              bg="gray.100"
              px={4}
              py={2}
              borderRadius="md"
              fontSize="sm"
              _hover={{ bg: 'gray.200' }}
            >
              📸 Pilih Foto Profil (Nanti)
            </FormLabel>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              display="none"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </Center>

          <FormControl isRequired>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Nomor HP (WhatsApp)</FormLabel>
            <InputGroup>
              <InputLeftAddon>+62</InputLeftAddon>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Alamat Lengkap</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <Checkbox
              colorScheme="red"
              isChecked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            >
              <Text fontSize="sm">
                Saya menyetujui{' '}
                <ChakraLink
                  as={Link}
                  to="/terms"
                  color="red.500"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  Syarat & Ketentuan
                </ChakraLink>
              </Text>
            </Checkbox>
          </FormControl>

          <Button
            colorScheme="red"
            size="lg"
            isLoading={loading}
            onClick={handleRegister}
          >
            Daftar Sekarang
          </Button>

          <Text textAlign="center" fontSize="sm">
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: '#E53E3E', fontWeight: 'bold' }}>
              Login di sini
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
