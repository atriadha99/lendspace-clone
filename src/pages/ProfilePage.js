// src/pages/ProfilePage.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Avatar, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Spinner,
  Container,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from "@chakra-ui/react";

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  // Warna dinamis untuk Dark/Light mode
  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // --- Simulasi data user (Nanti diganti fetch dari Supabase) ---
  useEffect(() => {
    const dummyUser = {
      name: "Dika Dhaniska",
      username: "@dika.dev",
      email: "dika@example.com",
      phone: "08123456789",
      address: "Bandung, Jawa Barat",
      balance: 250000,
      rating: 4.8,
      joined: "Maret 2024",
      profilePic: "https://bit.ly/dan-abramov", // Contoh avatar
      items: [
        {
          name: "Kamera Canon EOS 80D",
          price: 150000,
          unit: "/ hari",
          status: "Available",
        },
        {
          name: "Tripod Carbon Fiber",
          price: 50000,
          unit: "/ hari",
          status: "Rented",
        },
      ],
      transactions: [
        {
          id: "#TX1234",
          item: "Lensa 50mm f/1.8",
          date: "12 Okt 2025",
          status: "Selesai",
        },
        {
          id: "#TX1241",
          item: "Lighting Kit",
          date: "10 Okt 2025",
          status: "Berlangsung",
        },
      ],
    };

    // Simulasi delay network
    setTimeout(() => setUserData(dummyUser), 700);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!userData) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      
      {/* 1. HEADER SECTION (Profil & Saldo) */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
        
        {/* Kartu Profil (Kiri) */}
        <Box 
          gridColumn={{ md: "span 2" }} 
          p={6} 
          bg={bgCard} 
          borderRadius="xl" 
          borderWidth="1px" 
          borderColor={borderColor}
          shadow="sm"
        >
          <Flex direction={{ base: "column", sm: "row" }} align="center" gap={6}>
            <Avatar size="2xl" name={userData.name} src={userData.profilePic} />
            <VStack align={{ base: "center", sm: "flex-start" }} spacing={1}>
              <Heading size="lg">{userData.name}</Heading>
              <Text color="gray.500" fontWeight="medium">{userData.username}</Text>
              <Text>{userData.email} • {userData.phone}</Text>
              <Text color="gray.500">{userData.address}</Text>
              <HStack mt={2}>
                <Badge colorScheme="yellow" fontSize="0.9em">⭐ {userData.rating}</Badge>
                <Text fontSize="sm" color="gray.500">Bergabung {userData.joined}</Text>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        {/* Kartu Saldo (Kanan) */}
        <Box 
          p={6} 
          bg={bgCard} 
          borderRadius="xl" 
          borderWidth="1px" 
          borderColor={borderColor}
          shadow="sm"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Stat>
            <StatLabel fontSize="lg" color="gray.500">Saldo Dompet</StatLabel>
            <StatNumber fontSize="3xl" color="green.500">
              Rp {userData.balance.toLocaleString('id-ID')}
            </StatNumber>
            <StatHelpText>Dapat ditarik kapan saja</StatHelpText>
          </Stat>
          <Button mt={4} colorScheme="green" variant="outline" w="100%">
            Tarik Dana
          </Button>
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      {/* 2. ITEM SECTION (Barang Saya) */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Barang yang Disewakan</Heading>
          <Button size="sm" colorScheme="red">+ Tambah Barang</Button>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {userData.items.map((item, index) => (
            <Box 
              key={index} 
              p={5} 
              bg={bgCard} 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="lg"
              _hover={{ shadow: "md" }}
            >
              <Flex justify="space-between" mb={2}>
                <Heading size="sm" noOfLines={1}>{item.name}</Heading>
                <Badge colorScheme={item.status === "Available" ? "green" : "blue"}>
                  {item.status}
                </Badge>
              </Flex>
              <Text fontWeight="bold" color="red.500">
                Rp {item.price.toLocaleString('id-ID')} 
                <Text as="span" fontSize="sm" color="gray.500" fontWeight="normal">{item.unit}</Text>
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* 3. TRANSACTION SECTION (Tabel) */}
      <Box mb={10}>
        <Heading size="md" mb={6}>Riwayat Transaksi</Heading>
        <Box 
          bg={bgCard} 
          borderWidth="1px" 
          borderColor={borderColor} 
          borderRadius="xl" 
          overflow="hidden"
        >
          <TableContainer>
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                <Tr>
                  <Th>ID Transaksi</Th>
                  <Th>Barang</Th>
                  <Th>Tanggal</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userData.transactions.map((tx, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{tx.id}</Td>
                    <Td>{tx.item}</Td>
                    <Td>{tx.date}</Td>
                    <Td>
                      <Badge 
                        colorScheme={tx.status === "Selesai" ? "green" : "orange"}
                        variant="subtle"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {tx.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* 4. LOGOUT BUTTON */}
      <Flex justify="center" mt={10} mb={10}>
        <Button 
          colorScheme="red" 
          variant="ghost" 
          size="lg" 
          onClick={handleLogout}
          width={{ base: "100%", md: "auto" }}
        >
          Logout dari Akun
        </Button>
      </Flex>

    </Container>
  );
}

export default ProfilePage;