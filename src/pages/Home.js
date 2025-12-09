// src/pages/Home.jsx
import { Box, Heading, SimpleGrid, Text, Button } from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

const trending = [
  { title: "Sony A7IV Full-Frame", price: "Rp450.000/hari", rating: 4.9 },
  { title: "Jasa Fotografer Wedding", price: "Rp8.500.000/event", rating: 5.0 },
  { title: "Toyota Innova Reborn 2024", price: "Rp650.000/hari", rating: 4.8 },
  { title: "DJI Mavic 3 Pro Cine", price: "Rp800.000/hari", rating: 4.9 },
  { title: "Excavator Mini 3 Ton", price: "Rp2.500.000/hari", rating: 4.7 },
  { title: "PlayStation 5 Disc Edition", price: "Rp150.000/hari", rating: 4.9 },
];

export default function Home() {
  return (
    <Box px={{ base: 4, md: 8 }} py={10}>
      {/* HERO */}
      <Box
        height="80vh"
        bg="linear-gradient(to right, rgba(0,0,0,0.8), transparent), url('https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1600')"
        bgSize="cover"
        bgPos="center"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        px={20}
      >
        <Box maxW="600px">
          <Heading size="3xl" mb={4}>Sewa Apa Pun, Kapan Pun</Heading>
          <Text fontSize="xl" mb={8}>Kamera pro, mobil, alat berat, jasa fotografer — semua ada di Lendspace</Text>
          <Button size="lg" colorScheme="red" bg="#E50914">Mulai Sewa Sekarang</Button>
        </Box>
      </Box>

      {/* TRENDING ROW */}
      <Box mt={20}>
        <Heading size="2xl" mb={8}>Sedang Trending</Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 5, xl: 6 }} spacing={6}>
          {trending.map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}