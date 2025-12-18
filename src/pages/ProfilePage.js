import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, VStack, Heading, Text, Avatar, 
  Badge, Card, CardBody, CardHeader, Stack, 
  Button, Divider, Flex, Stat, StatLabel, StatNumber, 
  useColorModeValue, Spinner, Grid, Icon, Tooltip
} from '@chakra-ui/react';
import { EditIcon, StarIcon, PhoneIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaCrown, FaIdCard } from 'react-icons/fa';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Warna Dinamis
  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return navigate('/login');
        setEmail(user.email);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <Flex justify="center" h="100vh" align="center"><Spinner size="xl" /></Flex>;

  const tier = profile?.membership_tier || 'regular';
  const isVip = tier === 'vip';
  const tierColor = isVip ? 'yellow' : tier === 'premium' ? 'blue' : 'gray';

  // Status Verifikasi
  const isPhoneVerified = profile?.is_phone_verified;
  const isKtpVerified = profile?.is_ktp_verified;

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        
        {/* --- HEADER PROFIL --- */}
        <Box w="full" bg={bgCard} p={6} borderRadius="xl" shadow="lg" textAlign="center" position="relative" borderTop="4px solid" borderColor={isVip ? 'gold' : 'red.500'}>
           <Button 
             position="absolute" top={4} right={4} 
             size="sm" leftIcon={<EditIcon />} 
             colorScheme="gray" variant="outline"
             onClick={() => navigate('/edit-profile')}
           >
             Edit / Verifikasi
           </Button>

           <Avatar 
             size="2xl" 
             src={profile?.avatar_url} 
             name={profile?.full_name} 
             border="4px solid" 
             borderColor={isVip ? 'gold' : 'white'}
             mb={4}
           />
           
           <Heading size="lg" color={textColor} display="flex" alignItems="center" justifyContent="center" gap={2}>
             {profile?.full_name || 'User Tanpa Nama'}
             {isKtpVerified && (
               <Tooltip label="Identitas Terverifikasi (KTP)">
                 <Icon as={CheckCircleIcon} color="blue.400" w={5} h={5} />
               </Tooltip>
             )}
           </Heading>
           <Text color={mutedColor} mb={4}>{email}</Text>

           <Flex justify="center" gap={2} wrap="wrap">
             <Badge colorScheme={tierColor} px={3} py={1} borderRadius="full" display="flex" alignItems="center" gap={1}>
               {isVip ? <Icon as={FaCrown} /> : <StarIcon />} {tier} MEMBER
             </Badge>
             
             {isKtpVerified ? (
                <Badge colorScheme="green" px={3} py={1} borderRadius="full" display="flex" alignItems="center" gap={1}>
                  <Icon as={FaIdCard} /> KTP VERIFIED
                </Badge>
             ) : (
                <Badge colorScheme="red" px={3} py={1} borderRadius="full" display="flex" alignItems="center" gap={1}>
                  <WarningIcon /> BELUM VERIFIKASI KTP
                </Badge>
             )}
           </Flex>
        </Box>

        {/* --- STATISTIK --- */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
          <Card bg={bgCard} shadow="md" borderRadius="xl">
            <CardBody>
              <Stat textAlign="center">
                <StatLabel color={mutedColor}>LendPoints</StatLabel>
                <StatNumber fontSize="3xl" color="red.500">{profile?.points || 0}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={bgCard} shadow="md" borderRadius="xl">
            <CardBody>
              <Stat textAlign="center">
                <StatLabel color={mutedColor}>Status Akun</StatLabel>
                <StatNumber fontSize="xl" color={isKtpVerified && isPhoneVerified ? 'green.500' : 'orange.500'}>
                  {isKtpVerified && isPhoneVerified ? 'Terpercaya' : 'Belum Lengkap'}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* --- DETAIL INFO --- */}
        <Card w="full" bg={bgCard} shadow="md" borderRadius="xl">
          <CardHeader>
            <Heading size="md">Informasi Kontak</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<Divider />} spacing={4}>
              <Box>
                <Heading size="xs" textTransform="uppercase" color={mutedColor} mb={1}>
                  <PhoneIcon mr={2} /> WhatsApp
                </Heading>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">{profile?.phone || '-'}</Text>
                  {isPhoneVerified && <Icon as={CheckCircleIcon} color="green.500" w={4} h={4} />}
                </Flex>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase" color={mutedColor} mb={1}>
                  <Icon as={FaMapMarkerAlt} mr={2} /> Alamat
                </Heading>
                <Text fontSize="sm">{profile?.address || '-'}</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>

      </VStack>
    </Container>
  );
};

export default ProfilePage;