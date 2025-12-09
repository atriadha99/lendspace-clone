// src/pages/ProfilePage.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from '../lib/supabaseClient'; 

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
  Container,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Input,
  useToast
} from "@chakra-ui/react";

function ProfilePage() {
  const navigate = useNavigate();
  // Kita gunakan optional chaining (?.) agar tidak error jika context belum siap
  const auth = useContext(AuthContext);
  const user = auth?.user; 
  const logout = auth?.logout;

  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  // --- HARD FIX: INISIALISASI DATA LANGSUNG (JANGAN NULL) ---
  // Kita isi data default langsung di sini agar halaman PASTI muncul
  const [userData, setUserData] = useState({
    name: user?.user_metadata?.full_name || "Dika Dhaniska (Demo)",
    username: user?.email || "@pengguna_baru",
    email: user?.email || "email@contoh.com",
    phone: "0812-3456-7890",
    address: "Jakarta, Indonesia",
    balance: 500000,
    rating: 4.8,
    joined: "Januari 2025",
    profilePic: "https://bit.ly/broken-link", 
    items: [
      {
        name: "Kamera Sony A7III",
        price: 350000,
        unit: "/ hari",
        status: "Available",
      },
      {
        name: "Lensa 24-70mm GM",
        price: 200000,
        unit: "/ hari",
        status: "Rented",
      }
    ],
    transactions: [
      {
        id: "#TRX-999",
        item: "Lighting Godox",
        date: "20 Okt 2025",
        status: "Selesai",
      }
    ],
  });

  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const uploadKTP = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `ktp/${fileName}`;

      const { error } = await supabase.storage.from('ktp_bucket').upload(filePath, file);
      if (error) throw error;

      toast({ title: "Upload Sukses", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "Gagal Upload", description: error.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/login");
  };

  // --- HAPUS BAGIAN "IF LOADING RETURN SPINNER" ---
  // Agar halaman langsung merender JSX di bawah ini

  return (
    <Container maxW="container.xl" py={8}>
      
      {/* 1. HEADER SECTION */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
        
        {/* KARTU PROFIL */}
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
            <VStack align={{ base: "center", sm: "flex-start" }} spacing={1} flex={1}>
              <Heading size="lg">{userData.name}</Heading>
              <Text color="gray.500" fontWeight="bold">{userData.username}</Text>
              <Text>{userData.email} • {userData.phone}</Text>
              <Text color="gray.500">{userData.address}</Text>
              
              <HStack mt={2}>
                <Badge colorScheme="yellow" fontSize="0.9em">⭐ {userData.rating}</Badge>
                <Badge colorScheme="blue" variant="outline">Member sejak {userData.joined}</Badge>
              </HStack>

              <Box mt={4} w="100%">
                <Text fontSize="xs" fontWeight="bold" mb={1} textTransform="uppercase" color="gray.500">
                  Verifikasi Identitas (KTP)
                </Text>
                <Input 
                    type="file" 
                    size="sm" 
                    p={1} 
                    border="1px dashed"
                    borderColor="gray.300"
                    accept="image/*"
                    onChange={uploadKTP}
                    isDisabled={uploading}
                />
              </Box>
            </VStack>
          </Flex>
        </Box>

        {/* KARTU SALDO */}
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
            <StatHelpText>Dapat ditarik ke rekening bank</StatHelpText>
          </Stat>
          <Button mt={4} colorScheme="green" width="100%">
            Tarik Dana
          </Button>
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      {/* 2. ITEM SECTION */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Barang Saya</Heading>
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
              position="relative"
              overflow="hidden"
            >
              <Box position="absolute" top={0} left={0} w="4px" h="100%" bg={item.status === "Available" ? "green.400" : "orange.400"} />
              <Flex justify="space-between" mb={2}>
                <Heading size="sm" noOfLines={1}>{item.name}</Heading>
                <Badge colorScheme={item.status === "Available" ? "green" : "orange"}>
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

      {/* 3. TRANSACTION SECTION */}
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
                  <Th>ID</Th>
                  <Th>Barang</Th>
                  <Th>Tanggal</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userData.transactions.map((tx, index) => (
                  <Tr key={index}>
                    <Td fontWeight="bold">{tx.id}</Td>
                    <Td>{tx.item}</Td>
                    <Td>{tx.date}</Td>
                    <Td>
                      <Badge colorScheme="green">{tx.status}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* LOGOUT BUTTON */}
      <Flex justify="center" mt={10} mb={10}>
        <Button 
          colorScheme="red" 
          variant="outline" 
          size="lg" 
          onClick={handleLogout}
          width={{ base: "100%", md: "300px" }}
        >
          Logout
        </Button>
      </Flex>

    </Container>
  );
}

export default ProfilePage;