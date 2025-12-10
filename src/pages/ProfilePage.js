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
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";

function ProfilePage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user; 
  const logout = auth?.logout;

  const toast = useToast();
  // Hook untuk membuka/menutup Modal Tambah Produk
  const { isOpen, onOpen, onClose } = useDisclosure(); 

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Style Variables
  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.800");
  const inputBg = useColorModeValue('gray.50', 'gray.600'); 

  // --- STATE DATA USER (TERMASUK ITEMS) ---
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
      { name: "Kamera Canon EOS 80D", price: 150000, unit: "/ hari", status: "Available", category: "Photography" },
      { name: "Tripod Carbon Fiber", price: 50000, unit: "/ hari", status: "Rented", category: "Photography" },
    ],
    transactions: [
      { id: "#TX1234", item: "Lensa 50mm f/1.8", date: "12 Okt 2025", status: "Selesai" }
    ],
  });

  // --- STATE FORM PRODUK BARU ---
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Photography',
    price: '',
    description: ''
  });

  // --- LOGIKA EDIT PROFIL ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    toast({ title: "Profil Disimpan", status: "success", duration: 2000, isClosable: true });
  };

  // --- LOGIKA TAMBAH PRODUK ---
  const handleAddProduct = async () => {
    // 1. Validasi Input
    if (!newProduct.name || !newProduct.price) {
        toast({ title: "Mohon lengkapi data", status: "warning", duration: 2000 });
        return;
    }

    try {
        setUploading(true);

        // 2. Simpan ke Supabase (Jika tabel ada)
        // const { error } = await supabase.from('products').insert([{ ...newProduct, lender_id: user.id }]);
        
        // 3. Update State Lokal (Agar langsung muncul di layar)
        const newItem = {
            name: newProduct.name,
            price: parseInt(newProduct.price),
            unit: "/ hari",
            status: "Available",
            category: newProduct.category
        };

        setUserData(prev => ({
            ...prev,
            items: [newItem, ...prev.items] // Tambah ke paling atas
        }));

        toast({ title: "Produk Berhasil Ditambahkan!", status: "success", duration: 3000 });
        onClose(); // Tutup Modal
        setNewProduct({ name: '', category: 'Photography', price: '', description: '' }); // Reset Form

    } catch (error) {
        toast({ title: "Gagal", description: error.message, status: "error" });
    } finally {
        setUploading(false);
    }
  };

  const uploadKTP = async (event) => {
    // ... (Logika upload KTP sama seperti sebelumnya) ...
    toast({ title: "Upload KTP (Simulasi) Berhasil", status: "success", duration: 2000 });
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/login");
  };

  return (
    <Container maxW="container.xl" py={8}>
      
      {/* 1. HEADER SECTION (PROFIL) */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
        <Box 
          gridColumn={{ md: "span 2" }} 
          p={6} bg={bgCard} borderRadius="xl" borderWidth="1px" borderColor={borderColor} shadow="sm" position="relative"
        >
          <Box position="absolute" top={4} right={4}>
            {!isEditing ? (
              <Button leftIcon={<EditIcon />} size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <HStack>
                <IconButton icon={<CloseIcon />} size="sm" colorScheme="red" onClick={() => setIsEditing(false)} />
                <IconButton icon={<CheckIcon />} size="sm" colorScheme="green" onClick={handleSaveProfile} />
              </HStack>
            )}
          </Box>

          <Flex direction={{ base: "column", sm: "row" }} gap={6}>
            <Avatar size="2xl" name={userData.name} src={userData.profilePic} />
            <VStack align="flex-start" spacing={3} flex={1} w="100%">
              {!isEditing ? (
                <>
                  <Box>
                    <Heading size="lg">{userData.name}</Heading>
                    <Text color="gray.500" fontWeight="bold">{userData.username}</Text>
                  </Box>
                  <Text>{userData.email} • {userData.phone}</Text>
                  <Text color="gray.500">{userData.address}</Text>
                  <HStack mt={2}>
                    <Badge colorScheme="yellow">⭐ {userData.rating}</Badge>
                    <Badge colorScheme="blue" variant="outline">Verified Lender</Badge>
                  </HStack>
                </>
              ) : (
                <VStack w="100%" spacing={3}>
                  <FormControl><FormLabel fontSize="sm">Nama</FormLabel><Input name="name" value={userData.name} onChange={handleInputChange} bg={inputBg}/></FormControl>
                  <FormControl><FormLabel fontSize="sm">HP</FormLabel><Input name="phone" value={userData.phone} onChange={handleInputChange} bg={inputBg}/></FormControl>
                  <FormControl><FormLabel fontSize="sm">Alamat</FormLabel><Input name="address" value={userData.address} onChange={handleInputChange} bg={inputBg}/></FormControl>
                </VStack>
              )}
            </VStack>
          </Flex>
        </Box>

        {/* KARTU SALDO */}
        <Box p={6} bg={bgCard} borderRadius="xl" borderWidth="1px" borderColor={borderColor} shadow="sm" display="flex" flexDirection="column" justifyContent="center">
          <Stat>
            <StatLabel fontSize="lg" color="gray.500">Saldo Dompet</StatLabel>
            <StatNumber fontSize="3xl" color="green.500">Rp {userData.balance.toLocaleString('id-ID')}</StatNumber>
            <StatHelpText>Dapat ditarik ke rekening bank</StatHelpText>
          </Stat>
          <Button mt={4} colorScheme="green" width="100%" onClick={() => navigate('/withdraw')}>Tarik Dana</Button>
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      {/* 2. ITEM SECTION (BARANG SAYA) */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Barang yang Disewakan</Heading>
          {/* TOMBOL MEMBUKA MODAL */}
          <Button size="sm" colorScheme="red" leftIcon={<AddIcon />} onClick={onOpen}>
            Tambah Barang
          </Button>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {userData.items.map((item, index) => (
            <Box key={index} p={5} bg={bgCard} borderWidth="1px" borderColor={borderColor} borderRadius="lg" position="relative" overflow="hidden">
              <Box position="absolute" top={0} left={0} w="4px" h="100%" bg={item.status === "Available" ? "green.400" : "orange.400"} />
              <Flex justify="space-between" mb={2}>
                <Heading size="sm" noOfLines={1}>{item.name}</Heading>
                <Badge colorScheme={item.status === "Available" ? "green" : "orange"}>{item.status}</Badge>
              </Flex>
              <Text fontWeight="bold" color="red.500">
                Rp {item.price.toLocaleString('id-ID')} <Text as="span" fontSize="sm" color="gray.500" fontWeight="normal">{item.unit}</Text>
              </Text>
              <Text fontSize="xs" color="gray.400" mt={2}>{item.category}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* 3. TRANSACTION SECTION */}
      <Box mb={10}>
        <Heading size="md" mb={6}>Riwayat Transaksi</Heading>
        <Box bg={bgCard} borderWidth="1px" borderColor={borderColor} borderRadius="xl" overflow="hidden">
          <TableContainer>
            <Table variant="simple">
              <Thead bg={tableHeaderBg}><Tr><Th>ID</Th><Th>Barang</Th><Th>Tanggal</Th><Th>Status</Th></Tr></Thead>
              <Tbody>
                {userData.transactions.map((tx, index) => (
                  <Tr key={index}>
                    <Td fontWeight="bold">{tx.id}</Td><Td>{tx.item}</Td><Td>{tx.date}</Td>
                    <Td><Badge colorScheme="green">{tx.status}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Flex justify="center" mt={10} mb={10}>
        <Button colorScheme="red" variant="outline" size="lg" onClick={handleLogout}>Logout</Button>
      </Flex>

      {/* --- MODAL TAMBAH PRODUK --- */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Barang Sewaan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nama Barang</FormLabel>
                <Input 
                  placeholder="Contoh: Kamera Sony A7III" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </FormControl>

              <HStack w="100%">
                <FormControl isRequired>
                    <FormLabel>Kategori</FormLabel>
                    <Select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                        <option value="Photography">Photography</option>
                        <option value="Tools">Tools</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Vehicles">Vehicles</option>
                    </Select>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Harga Sewa (per hari)</FormLabel>
                    <Input 
                        type="number" 
                        placeholder="150000" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Deskripsi & Kondisi</FormLabel>
                <Textarea 
                    placeholder="Jelaskan kondisi barang, kelengkapan, dll." 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Foto Barang</FormLabel>
                <Input type="file" pt={1} />
                <Text fontSize="xs" color="gray.500" mt={1}>Format JPG/PNG, Max 2MB</Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button 
                colorScheme="red" 
                onClick={handleAddProduct}
                isLoading={uploading}
                loadingText="Menyimpan"
            >
                Simpan Barang
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
}

export default ProfilePage;