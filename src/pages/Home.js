// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Pastikan import ini ada
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
  Badge,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { FaCamera, FaTools, FaLaptop, FaArrowRight, FaStar } from 'react-icons/fa';

// --- KOMPONEN KARTU PRODUK ---
const ProductCard = ({ product, onClick }) => {
  return (
    <Box
      maxW={'sm'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
      cursor="pointer"
      onClick={onClick}
      _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
    >
      <Box h={'210px'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
        <Image
          src={product.image_url || 'https://via.placeholder.com/300'}
          layout={'fill'}
          objectFit={'cover'}
          w="100%"
          h="100%"
        />
        {product.is_vip_only && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="yellow"
            variant="solid"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Icon as={FaStar} /> VIP ONLY
          </Badge>
        )}
      </Box>
      <Stack>
        <Text
          color={'green.500'}
          textTransform={'uppercase'}
          fontWeight={800}
          fontSize={'xs'}
          letterSpacing={1.1}
        >
          {product.category}
        </Text>
        <Heading
          color={useColorModeValue('gray.700', 'white')}
          fontSize={'2xl'}
          fontFamily={'body'}
        >
          {product.name}
        </Heading>
        <Text color={'gray.500'} noOfLines={2}>
          {product.description}
        </Text>
      </Stack>
      <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
        <Text fontWeight={600} fontSize={'xl'}>
          Rp {product.price.toLocaleString()} /hari
        </Text>
      </Stack>
    </Box>
  );
};

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIKA FETCH DATA DENGAN FILTER VIP ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // 1. Cek User & Status Member
        const { data: { user } } = await supabase.auth.getUser();
        let isMember = false;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('membership_tier')
            .eq('id', user.id)
            .single();
          
          if (profile?.membership_tier === 'premium' || profile?.membership_tier === 'vip') {
            isMember = true;
          }
        }

        // 2. Siapkan Query Dasar
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6); // Ambil 6 produk terbaru saja buat di Home

        // 3. Terapkan Filter VIP
        // Jika user BUKAN member, sembunyikan barang VIP
        if (!isMember) {
           query = query.eq('is_vip_only', false);
        }

        // 4. Eksekusi Query
        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);

      } catch (err) {
        console.error("Gagal ambil produk:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                  // Jika belum punya halaman catalog, arahkan ke bawah atau home
                  onClick={() => document.getElementById('latest-products').scrollIntoView({ behavior: 'smooth'})}
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

      {/* --- PRODUCT SECTION (HASIL FILTER VIP) --- */}
      <Box id="latest-products" bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
         <Container maxW="container.xl">
           <Heading textAlign="center" mb={2}>Rekomendasi Untuk Anda</Heading>
           <Text textAlign="center" color="gray.500" mb={10}>
              Barang-barang terbaru yang siap disewa hari ini.
           </Text>

           {loading ? (
             <Flex justify="center"><Spinner size="xl" /></Flex>
           ) : (
             <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {products.map((prod) => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    onClick={() => navigate(`/product/${prod.id}`)}
                  />
                ))}
             </SimpleGrid>
           )}
           
           {products.length === 0 && !loading && (
             <Text textAlign="center">Belum ada barang tersedia.</Text>
           )}
         </Container>
      </Box>

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