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
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

function ProfilePage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user; 
  const logout = auth?.logout;

  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. PINDAHKAN HOOKS KE ATAS SINI ---
  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.800");
  // Ini perbaikan utamanya: Definisikan warna input di sini, bukan di dalam JSX
  const inputBg = useColorModeValue('gray.50', 'gray.600'); 

  // --- DATA AWAL ---
  const [userData, setUserData] = useState({
    name: user?.user_metadata?.full_name || "Dika Dhaniska",
    username: user?.email || "@dika.dev",
    email: user?.email || "dika@example.com",
    phone: "0812-3456-7890",
    address: "Bandung, Jawa Barat",
    balance: 500000,
    rating: 4.8,
    joined: "Maret 2024",
    profilePic: "https://bit.ly/dan-abramov", 
    items: [
      { name: "Kamera Canon EOS 80D", price: 150000, unit: "/ hari", status: "Available" },
      { name: "Tripod Carbon Fiber", price: 50000, unit: "/ hari", status: "Rented" },
    ],
    transactions: [
      { id: "#TX1234", item: "Lensa 50mm f/1.8", date: "12 Okt 2025", status: "Selesai" }
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userData.name,
            phone: userData.phone,
          })
          .eq('id', user.id);

        if (error) throw error;
      }
      setIsEditing(false);
      toast({
        title: "Profil Diperbarui",
        description: "Data berhasil disimpan.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  return (
    <Container maxW="container.xl" py={8}>
      
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
          position="relative"
        >
          <Box position="absolute" top={4} right={4}>
            {!isEditing ? (
              <Button 
                leftIcon={<EditIcon />} 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <HStack>
                <IconButton 
                  icon={<CloseIcon />} 
                  size="sm" 
                  colorScheme="red" 
                  aria-label="Cancel"
                  onClick={() => setIsEditing(false)} 
                />
                <IconButton 
                  icon={<CheckIcon />} 
                  size="sm" 
                  colorScheme="green" 
                  aria-label="Save"
                  onClick={handleSaveProfile} 
                />
              </HStack>
            )}
          </Box>

          <Flex direction={{ base: "column", sm: "row" }} gap={6}>
            <VStack>
              <Avatar size="2xl" name={userData.name} src={userData.profilePic} />
              {isEditing && (
                 <Button size="xs" mt={2}>Ganti Foto</Button>
              )}
            </VStack>
            
            <VStack align="flex-start" spacing={3} flex={1} w="100%">
              
              {!isEditing ? (
                // --- VIEW MODE ---
                <>
                  <Box>
                    <Heading size="lg">{userData.name}</Heading>
                    <Text color="gray.500" fontWeight="bold">{userData.username}</Text>
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">Email</Text>
                    <Text>{userData.email}</Text>
                  </VStack>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">Nomor HP</Text>
                    <Text>{userData.phone}</Text>
                  </VStack>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">Alamat</Text>
                    <Text>{userData.address}</Text>
                  </VStack>
                  <HStack mt={2}>
                    <Badge colorScheme="yellow" fontSize="0.9em">⭐ {userData.rating}</Badge>
                    <Badge colorScheme="blue" variant="outline">Member sejak {userData.joined}</Badge>
                  </HStack>
                </>
              ) : (
                // --- EDIT MODE ---
                <VStack w="100%" spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Nama Lengkap</FormLabel>
                    <Input 
                      name="name" 
                      value={userData.name} 
                      onChange={handleInputChange} 
                      bg={inputBg} // Menggunakan variabel hook dari atas
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Nomor HP</FormLabel>
                    <Input 
                      name="phone" 
                      value={userData.phone} 
                      onChange={handleInputChange} 
                      bg={inputBg} // Menggunakan variabel hook dari atas
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Alamat</FormLabel>
                    <Textarea 
                      name="address" 
                      value={userData.address} 
                      onChange={handleInputChange} 
                      bg={inputBg} // Menggunakan variabel hook dari atas
                    />
                  </FormControl>
                  
                  <FormControl isReadOnly>
                    <FormLabel fontSize="sm">Email (Tidak dapat diubah)</FormLabel>
                    <Input value={userData.email} variant="filled" />
                  </FormControl>
                </VStack>
              )}

              <Box mt={4} w="100%" borderTop="1px dashed" borderColor="gray.300" pt={3}>
                <Text fontSize="xs" fontWeight="bold" mb={1} textTransform="uppercase" color="gray.500">
                  Verifikasi Identitas (KTP)
                </Text>
                <Input 
                    type="file" 
                    size="sm" 
                    p={1} 
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
          </Stat><Button 
  mt={4} 
  colorScheme="green" 
  width="100%"
  onClick={() => navigate('/withdraw')} // <-- Tambahkan ini
>
  Tarik Dana
</Button>
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      {/* ITEM SECTION */}
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

      {/* TRANSACTION SECTION */}
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
              <Thead bg={tableHeaderBg}>
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