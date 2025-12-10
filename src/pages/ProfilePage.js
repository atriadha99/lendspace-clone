// src/pages/ProfilePage.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from '../lib/supabaseClient'; 

import { 
  Box, Flex, Heading, Text, Button, Avatar, VStack, HStack, SimpleGrid, Badge,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue, Container,
  Divider, Stat, StatLabel, StatNumber, StatHelpText, Input, Textarea,
  FormControl, FormLabel, IconButton, useToast, Select, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); 

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State Data User
  const [userData, setUserData] = useState({
    name: user?.user_metadata?.full_name || "User",
    username: user?.email || "",
    email: user?.email || "",
    phone: "0812-XXXX-XXXX",
    address: "Indonesia",
    balance: 0,
    rating: 0,
    items: [], // Nanti diisi dari database
    transactions: []
  });

  // State Form Produk Baru
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Photography',
    price: '',
    description: ''
  });
  const [productImage, setProductImage] = useState(null); // State khusus file gambar

  const bgCard = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue('gray.50', 'gray.600'); 

  // --- 1. FETCH DATA REAL DARI SUPABASE ---
  useEffect(() => {
    async function fetchData() {
        if (!user) return;

        // Ambil Produk Saya (yang diupload user ini)
        // Asumsi: Di tabel products ada kolom 'lender_name' yang kita isi dengan email/nama user sementara
        // Idealnya menggunakan user_id, tapi untuk demo kita filter client-side atau sederhana
        const { data: myProducts, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (myProducts) {
            // Filter produk yang namanya mirip atau buatan user (jika ada kolom user_id lebih baik)
            // Untuk sekarang kita tampilkan semua dulu atau filter manual
            setUserData(prev => ({ ...prev, items: myProducts }));
        }
    }
    fetchData();
  }, [user]);

  // --- 2. FUNGSI TAMBAH PRODUK KE DATABASE ---
  const handleAddProduct = async () => {
    // Validasi
    if (!newProduct.name || !newProduct.price || !productImage) {
        toast({ title: "Data belum lengkap", description: "Pastikan nama, harga, dan foto diisi.", status: "warning" });
        return;
    }

    setUploading(true);
    try {
        // A. Upload Gambar ke Storage
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product_images') // Pastikan bucket ini ada!
            .upload(filePath, productImage);

        if (uploadError) throw uploadError;

        // B. Ambil URL Publik Gambar
        const { data: urlData } = supabase.storage
            .from('product_images')
            .getPublicUrl(filePath);
        
        const publicImageUrl = urlData.publicUrl;

        // C. Insert ke Tabel Products
        const { data, error: insertError } = await supabase
            .from('products')
            .insert([
                {
                    name: newProduct.name,
                    category: newProduct.category,
                    price: parseInt(newProduct.price),
                    description: newProduct.description,
                    image_url: publicImageUrl,
                    lender_name: userData.name || user.email, // Simpan nama pemilik
                    rating: 5.0, // Rating awal
                    // lender_id: user.id // Jika kolom ini ada di tabel
                }
            ])
            .select(); // Agar data yang baru masuk dikembalikan

        if (insertError) throw insertError;

        // D. Update Tampilan (Tanpa Refresh)
        if (data) {
            setUserData(prev => ({
                ...prev,
                items: [data[0], ...prev.items]
            }));
        }

        toast({ title: "Produk Berhasil Ditambahkan!", status: "success" });
        onClose();
        setNewProduct({ name: '', category: 'Photography', price: '', description: '' });
        setProductImage(null);

    } catch (error) {
        console.error(error);
        toast({ title: "Gagal Menyimpan", description: error.message, status: "error" });
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
      
      {/* HEADER SECTION */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
        <Box gridColumn={{ md: "span 2" }} p={6} bg={bgCard} borderRadius="xl" shadow="sm">
          <Flex direction={{ base: "column", sm: "row" }} gap={6}>
            <Avatar size="2xl" name={userData.name} />
            <VStack align="flex-start" spacing={3} flex={1}>
                <Heading size="lg">{userData.name}</Heading>
                <Text color="gray.500">{userData.email}</Text>
                <Badge colorScheme="blue">Verified Lender</Badge>
            </VStack>
          </Flex>
        </Box>

        <Box p={6} bg={bgCard} borderRadius="xl" shadow="sm" display="flex" flexDirection="column" justifyContent="center">
          <Stat>
            <StatLabel fontSize="lg">Saldo Dompet</StatLabel>
            <StatNumber fontSize="3xl" color="green.500">Rp {userData.balance.toLocaleString('id-ID')}</StatNumber>
          </Stat>
          <Button mt={4} colorScheme="green" onClick={() => navigate('/withdraw')}>Tarik Dana</Button>
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      {/* BARANG SAYA */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Barang yang Disewakan</Heading>
          <Button size="sm" colorScheme="red" leftIcon={<AddIcon />} onClick={onOpen}>
            Tambah Barang
          </Button>
        </Flex>
        
        {userData.items.length === 0 ? (
            <Text color="gray.500" align="center">Belum ada barang. Yuk tambah sekarang!</Text>
        ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {userData.items.map((item, index) => (
                <Box key={index} p={5} bg={bgCard} borderWidth="1px" borderRadius="lg" position="relative">
                <Flex justify="space-between" mb={2}>
                    <Heading size="sm" noOfLines={1}>{item.name}</Heading>
                    <Badge colorScheme="green">Aktif</Badge>
                </Flex>
                <Text fontWeight="bold" color="red.500">
                    Rp {item.price.toLocaleString('id-ID')} / hari
                </Text>
                <Text fontSize="xs" color="gray.400">{item.category}</Text>
                </Box>
            ))}
            </SimpleGrid>
        )}
      </Box>

      {/* LOGOUT */}
      <Flex justify="center" mb={10}>
        <Button colorScheme="red" variant="outline" onClick={handleLogout}>Logout</Button>
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
                <FormLabel>Deskripsi</FormLabel>
                <Textarea 
                    placeholder="Kondisi barang..." 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Foto Barang</FormLabel>
                <Input 
                    type="file" 
                    pt={1} 
                    accept="image/*"
                    onChange={(e) => setProductImage(e.target.files[0])} // Simpan file ke state
                />
                <Text fontSize="xs" color="gray.500" mt={1}>Wajib diisi (JPG/PNG)</Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Batal</Button>
            <Button 
                colorScheme="red" 
                onClick={handleAddProduct}
                isLoading={uploading}
                loadingText="Upload..."
            >
                Simpan & Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
}

export default ProfilePage;