// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCamera, FaTools, FaLaptop, FaArrowRight } from 'react-icons/fa'; // Pastikan install react-icons jika belum

const Feature = ({ title, text, icon }) => {
  return (
    <Stack 
      align={'center'} 
      textAlign={'center'} 
      p={8} 
      bg={useColorModeValue('white', 'gray.800')} 
      rounded={'xl'} 
      shadow={'lg'}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      <Box p={3} bg={'red.500'} color={'white'} rounded={'full'} mb={2}>
        <Icon as={icon} w={6} h={6} />
      </Box>
      <Heading size="md">{title}</Heading>
      <Text color={'gray.500'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* --- HERO SECTION --- */}
      <Box
        w="100%"
        h={{ base: '70vh', md: '80vh' }}
        bgImage="url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
      >
        {/* Overlay Gelap */}
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="blackAlpha.700" />

        <Container maxW="container.xl" h="100%" position="relative" zIndex={1}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            h="100%"
            align="center"
            justify="center"
            spacing={10}
          >
            <Stack spacing={6} textAlign="center" maxW="800px">
              <Heading
                fontSize={{ base: '4xl', md: '6xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="1.2"
              >
                Sewa Alat Profesional <br />
                <Text as="span" color="red.500">Tanpa Beli Mahal</Text>
              </Heading>
              <Text fontSize="xl" color="gray.200">
                Marketplace penyewaan alat terlengkap. Kamera, Lensa, Drone, hingga Alat Tukang. 
                Aman, Cepat, dan Terpercaya.
              </Text>
              <Stack direction="row" spacing={4} justify="center">
                <Button
                  size="lg"
                  colorScheme="red"
                  rightIcon={<FaArrowRight />}
                  onClick={() => navigate('/catalog')}
                >
                  Mulai Sewa
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="whiteAlpha"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => navigate('/register')}
                >
                  Jadi Lender
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* --- CATEGORY SECTION --- */}
      <Container maxW="container.xl" py={20}>
        <Heading textAlign="center" mb={10}>Kategori Populer</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={FaCamera}
            title={'Fotografi & Videografi'}
            text={'Sewa kamera mirrorless, lensa, dan lighting untuk project kreatifmu.'}
          />
          <Feature
            icon={FaTools}
            title={'Peralatan Tukang'}
            text={'Bor, gergaji mesin, dan alat pertukangan berat untuk renovasi rumah.'}
          />
          <Feature
            icon={FaLaptop}
            title={'Elektronik & Gadget'}
            text={'Laptop spesifikasi tinggi, tablet, dan konsol game untuk kebutuhan harian.'}
          />
        </SimpleGrid>
      </Container>

      {/* --- BANNER SECTION --- */}
      <Box bg={useColorModeValue('gray.100', 'gray.900')} py={16}>
        <Container maxW="container.xl">
          <Stack direction={{ base: 'column', md: 'row' }} align="center" spacing={10}>
            <Box flex={1}>
              <Image 
                rounded="lg"
                shadow="2xl"
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                alt="Payment"
              />
            </Box>
            <Stack flex={1} spacing={6}>
              <Heading size="2xl">Monetisasi Aset Menganggur</Heading>
              <Text fontSize="lg" color="gray.500">
                Punya kamera yang jarang dipakai? Atau alat kemah yang menumpuk di gudang?
                Daftarkan di Lendspace dan dapatkan penghasilan tambahan dengan aman.
                Kami memverifikasi setiap penyewa.
              </Text>
              <Button colorScheme="red" size="lg" alignSelf="start" onClick={() => navigate('/register')}>
                Daftar Sebagai Lender
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}