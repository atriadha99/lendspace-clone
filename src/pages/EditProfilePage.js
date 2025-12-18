import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, FormControl, FormLabel, Input, Button, useToast, VStack, Spinner, Flex,
  useColorModeValue, InputGroup, InputRightElement, Badge, Icon,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, PinInput, PinInputField, HStack, Text, Image
} from '@chakra-ui/react';
import { CheckCircleIcon, AttachmentIcon } from '@chakra-ui/icons';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  
  // --- 1. PINDAHKAN SEMUA HOOKS WARNA KE SINI (PALING ATAS) ---
  const bgForm = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const bgKtpBox = useColorModeValue('gray.50', 'gray.800'); // <--- INI YANG BIKIN ERROR SEBELUMNYA
  const ktpBorderColor = useColorModeValue('gray.300', 'gray.500');

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ktpUrl, setKtpUrl] = useState(null);
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isKtpVerified, setIsKtpVerified] = useState(false);

  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

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
          // Avatar URL dihapus karena tidak ditampilkan di form ini
          setKtpUrl(data.ktp_url);
          setIsPhoneVerified(data.is_phone_verified);
          setIsKtpVerified(data.is_ktp_verified);
        }
      } catch (error) {
        console.error(error);
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

      toast({ title: "Profil berhasil disimpan!", status: "success" });
      navigate('/profile'); 
    } catch (error) {
      toast({ title: "Gagal update", description: error.message, status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (otpCode === '123456') {
      setVerifying(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('profiles').update({ is_phone_verified: true }).eq('id', user.id);
      
      setIsPhoneVerified(true);
      setVerifying(false);
      onClose();
      toast({ title: "Nomor Telepon Terverifikasi!", status: "success" });
    } else {
      toast({ title: "Kode OTP Salah", description: "Gunakan kode 123456", status: "error" });
    }
  };

  const handleUploadKTP = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `ktp-${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ktp-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('ktp-images').getPublicUrl(fileName);

      await supabase.from('profiles').update({
        ktp_url: publicUrlData.publicUrl,
        is_ktp_verified: true
      }).eq('id', user.id);

      setKtpUrl(publicUrlData.publicUrl);
      setIsKtpVerified(true);
      toast({ title: "KTP Berhasil Diupload & Diverifikasi!", status: "success" });

    } catch (error) {
      toast({ title: "Gagal Upload KTP", description: error.message, status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Flex justify="center" h="100vh" align="center"><Spinner size="xl" /></Flex>;

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} bg={bgForm} color={textColor} shadow="lg" borderRadius="xl">
        <Heading mb={6} size="lg">Verifikasi & Biodata</Heading>
        
        <VStack spacing={6} align="stretch">
          
          <FormControl>
            <FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Nomor WhatsApp</FormLabel>
            <InputGroup>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                type="tel" 
                borderColor={isPhoneVerified ? 'green.400' : 'gray.200'}
              />
              <InputRightElement width="6rem">
                {isPhoneVerified ? (
                  <Badge colorScheme="green" variant="solid" borderRadius="full" px={2} mr={2}>
                    <Icon as={CheckCircleIcon} mr={1} /> Verified
                  </Badge>
                ) : (
                  <Button h="1.75rem" size="xs" colorScheme="blue" mr={2} onClick={onOpen} isDisabled={!phone}>
                    Verifikasi
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
            {!isPhoneVerified && <Text fontSize="xs" color="gray.500" mt={1}>Klik verifikasi untuk mendapatkan OTP.</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Foto E-KTP</FormLabel>
            {/* Menggunakan variabel bgKtpBox yang sudah dideklarasikan di atas */}
            <Box 
              border="2px dashed" 
              borderColor={isKtpVerified ? 'green.400' : ktpBorderColor} 
              borderRadius="md" 
              p={4} 
              textAlign="center"
              bg={bgKtpBox} 
            >
              {ktpUrl ? (
                <VStack>
                   <Image src={ktpUrl} h="150px" objectFit="contain" borderRadius="md" />
                   {isKtpVerified && <Badge colorScheme="green"><CheckCircleIcon mr={1}/> Terverifikasi</Badge>}
                   <Button size="xs" onClick={() => document.getElementById('ktpInput').click()}>Ganti Foto</Button>
                </VStack>
              ) : (
                <VStack py={4}>
                  <AttachmentIcon w={8} h={8} color="gray.400" />
                  <Text fontSize="sm" color="gray.500">Upload foto KTP yang jelas</Text>
                  <Button size="sm" onClick={() => document.getElementById('ktpInput').click()}>Pilih File</Button>
                </VStack>
              )}
              <Input id="ktpInput" type="file" display="none" accept="image/*" onChange={handleUploadKTP} />
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel>Alamat Lengkap</FormLabel>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormControl>

          <Flex gap={3} mt={4}>
             <Button variant="ghost" onClick={() => navigate('/profile')} w="full">Kembali</Button>
             <Button colorScheme="red" onClick={handleUpdate} isLoading={updating} w="full">
               Simpan Data
             </Button>
          </Flex>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verifikasi Nomor HP</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Text mb={4}>Masukkan kode OTP yang dikirim ke <b>{phone}</b></Text>
            <Text mb={2} fontSize="sm" color="blue.500">(Kode Simulasi: 123456)</Text>
            
            <HStack justify="center" mb={4}>
              <PinInput otp value={otpCode} onChange={setOtpCode}>
                <PinInputField /><PinInputField /><PinInputField /><PinInputField /><PinInputField /><PinInputField />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" w="full" onClick={handleVerifyPhone} isLoading={verifying}>
              Verifikasi Sekarang
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
};

export default EditProfilePage;