import { Box, Image, Text, Badge } from '@chakra-ui/react';

export default function ProductCard({ title, price, rating }) {
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ transform: 'scale(1.08)', shadow: '2xl' }}
    >
      <Box height="300px" bg="gray.800" position="relative">
        <Image src="/api/placeholder/400/600" alt={title} height="100%" width="100%" objectFit="cover" />
        <Badge position="absolute" top="2" right="2" colorScheme="red">{rating} ★</Badge>
      </Box>
      <Box p={3}>
        <Text fontWeight="bold" noOfLines={2}>{title}</Text>
        <Text color="#E50914" fontWeight="bold">{price}</Text>
      </Box>
    </Box>
  );
}