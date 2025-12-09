// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Image,
  VStack,
  Stack,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box bg="black" color="white" minH="100vh">
      {/* 1. HERO SECTION (Netflix Style) */}
      <Box
        w="100%"
        h={{ base: "80vh", md: "90vh" }}
        bgImage="url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        borderBottom="8px solid #222"
      >
        {/* Overlay Gelap */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bgGradient="linear(to-b, blackAlpha.800, blackAlpha.400, black)"
        />

        <Container maxW="container.xl" position="relative" zIndex="1" h="100%" centerContent justifyContent="center">
          <VStack spacing={6} textAlign="center" maxW="800px">
            <Heading as="h1" size="4xl" fontWeight="800" lineHeight="1.1">
              Unlimited tools, cameras, and equipment.
            </Heading>
            <Text fontSize="2xl" fontWeight="500">
              Rent anywhere. Return anytime.
            </Text>
            <Text fontSize="xl" pt={4}>
              Ready to start? Enter your email to create or restart your membership.
            </Text>

            {/* Input Email & CTA */}
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" maxW="600px" spacing={2} pt={2}>
              <Input 
                placeholder="Email address" 
                size="lg" 
                h="60px" 
                bg="blackAlpha.600" 
                border="1px solid gray"
                _placeholder={{ color: 'gray.400' }}
              />
              <Button 
                colorScheme="red" 
                size="lg" 
                h="60px" 
                px={8} 
                fontSize="2xl" 
                rightIcon={<ChevronRightIcon />}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      {/* 2. FEATURE SECTION 1 (Text Left, Image Right) */}
      <Box borderBottom="8px solid #222" py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Box flex="1" textAlign={{ base: 'center', md: 'left' }} mb={{ base: 10, md: 0 }}>
              <Heading fontSize="5xl" mb={4}>Grow your Business.</Heading>
              <Text fontSize="2xl">
                Access premium equipment for your projects without the heavy upfront cost.
              </Text>
            </Box>
            <Box flex="1" position="relative">
              {/* Gambar TV / Monitor */}
              <Image 
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" 
                alt="TV" 
                position="relative" 
                zIndex="2"
              />
              {/* Video simulasi di dalam TV (pake gambar statis kamera) */}
              <Image 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
                position="absolute"
                top="20%"
                left="13%"
                w="73%"
                h="54%"
                objectFit="cover"
                zIndex="1"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* 3. FEATURE SECTION 2 (Image Left, Text Right) */}
      <Box borderBottom="8px solid #222" py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column-reverse', md: 'row' }} align="center" justify="space-between">
            <Box flex="1" position="relative">
              <Image src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg" alt="Mobile" />
              {/* Card Download Overlay */}
              <Box 
                position="absolute" 
                bottom="10%" 
                left="50%" 
                transform="translateX(-50%)" 
                bg="black" 
                border="2px solid #333" 
                borderRadius="xl" 
                p={2} 
                w="60%" 
                display="flex" 
                alignItems="center"
                boxShadow="lg"
              >
                <Image src="https://i.ibb.co/6yv4d66/camera.jpg" w="50px" h="70px" objectFit="cover" mr={4} />
                <Box flex="1">
                  <Text fontWeight="bold">Canon EOS R5</Text>
                  <Text fontSize="sm" color="blue.400">Listing...</Text>
                </Box>
                <Box>⬇️</Box>
              </Box>
            </Box>
            <Box flex="1" textAlign={{ base: 'center', md: 'left' }} pl={{ md: 10 }} mb={{ base: 10, md: 0 }}>
              <Heading fontSize="5xl" mb={4}>Monetize Idle Assets.</Heading>
              <Text fontSize="2xl">
                List your unused gear easily and earn extra income securely with insurance protection.
              </Text>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* 4. FEATURE SECTION 3 (Text Left, Image Right) */}
      <Box borderBottom="8px solid #222" py={20}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Box flex="1" textAlign={{ base: 'center', md: 'left' }} mb={{ base: 10, md: 0 }}>
              <Heading fontSize="5xl" mb={4}>Rent everywhere.</Heading>
              <Text fontSize="2xl">
                Streamline your workflow on your phone, tablet, laptop, and desktop without paying more.
              </Text>
            </Box>
            <Box flex="1">
              <Image src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png" alt="Devices" />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* 5. FAQ SECTION */}
      <Box borderBottom="8px solid #222" py={20}>
        <Container maxW="container.md">
          <Heading textAlign="center" fontSize="5xl" mb={10}>Frequently Asked Questions</Heading>
          
          <Accordion allowToggle>
            {[
              { q: "What is Lendspace?", a: "Lendspace is a B2B sharing economy platform that connects businesses with idle assets to those who need them." },
              { q: "How much does it cost?", a: "Browsing is free. Renting costs vary by item and duration. Lenders pay a small service fee on successful transactions." },
              { q: "Where can I rent?", a: "Available anywhere in Indonesia. Find gear near you or get it shipped securely." },
              { q: "Is it safe?", a: "Yes. We use verified IDs, secure payment gateways, and optional insurance for all high-value assets." },
            ].map((item, index) => (
              <AccordionItem key={index} mb={2} border="none">
                <h2>
                  <AccordionButton bg="#303030" _hover={{ bg: "#404040" }} p={6}>
                    <Box flex="1" textAlign="left" fontSize="2xl">
                      {item.q}
                    </Box>
                    <AccordionIcon w={8} h={8} />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={6} bg="#303030" fontSize="xl" mt="1px">
                  {item.a}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <VStack mt={10} spacing={4}>
            <Text fontSize="xl">Ready to start? Enter your email to create or restart your membership.</Text>
            <Stack direction={{ base: 'column', md: 'row' }} w="100%" maxW="600px" spacing={2}>
              <Input placeholder="Email address" size="lg" h="60px" bg="blackAlpha.600" border="1px solid gray" />
              <Button onClick={() => navigate('/register')} colorScheme="red" size="lg" h="60px" px={8} fontSize="2xl" rightIcon={<ChevronRightIcon />}>
                Get Started
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      {/* 6. FOOTER */}
      <Box py={20} color="gray.500">
        <Container maxW="container.xl">
          <Text mb={6}>Questions? Call 007-803-321-2130</Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} fontSize="sm">
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>FAQ</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Help Center</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Account</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Media Center</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Investor Relations</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Jobs</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Ways to Rent</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Terms of Use</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Privacy</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Cookie Preferences</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Corporate Information</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Contact Us</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Speed Test</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Legal Notices</Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>Only on Lendspace</Text>
          </SimpleGrid>
          <Text mt={8} fontSize="sm">Lendspace Indonesia</Text>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;