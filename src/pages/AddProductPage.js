import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, VStack, FormControl, FormLabel, 
  Input, Textarea, Select, Button, useToast, Text, NumberInput, NumberInputField
} from '@chakra-ui/react';

const AddProductPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  
  // State Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Kamera',
    stock: 1,
    deposit_percent: 30, // Default 30%
  });
  const [imageFile, setImageFile] = useState(null);

  const handleUpload = async () => {
    if (!newProduct.name || !newProduct.price || !imageFile) {
      toast({ title: "Mohon lengkapi data & gambar", status: "warning" });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Anda harus login");

      // 1. Upload Gambar
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images') // Pastikan bucket ini ada di Supabase Storage
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // 2. Insert Data
      const { error: insertError } = await supabase.from('products').insert({
        name: newProduct.name,
        description: newProduct.description,
        price: parseInt(newProduct.price),
        quantity: parseInt(newProduct.stock),
        category: newProduct.category,
        image_url: publicUrl,
        lender_id: user.id,
        status: 'available',
        deposit_percent: parseInt(newProduct.deposit_percent)
      });

      if (insertError) throw insertError;

      toast({ title: "Produk Berhasil Diupload!", status: "success" });
      navigate('/');

    } catch (err) {
      toast({ title: "Gagal", description: err.message, status: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="white" p={8} rounded="xl" shadow="lg">
        <Heading mb={6}>Sewakan Barang Anda</Heading>
        
        <VStack spacing={4} align="stretch">
          
          <FormControl isRequired>
            <FormLabel>Nama Produk</FormLabel>
            <Input 
              placeholder="Contoh: Sony A7 III" 
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Kategori</FormLabel>
            <Select 
              value={newProduct.category} 
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option value="Kamera">Kamera</option>
              <option value="Lensa">Lensa</option>
              <option value="Drone">Drone</option>
              <option value="Laptop">Laptop</option>
              <option value="Console">Game Console</option>
              <option value="Lainnya">Lainnya</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Harga Sewa (Per Hari)</FormLabel>
            <Input 
              type="number" 
              placeholder="Rp 0"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </FormControl>

          {/* INPUT DP YANG ANDA MINTA */}
          <FormControl>
            <FormLabel>DP yang diminta (% dari total)</FormLabel>
            <Input
              type="number"
              min="0"
              max="100"
              value={newProduct.deposit_percent}
              onChange={(e) => setNewProduct({...newProduct, deposit_percent: e.target.value})}
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              0 = Tanpa DP, 30 = DP 30%, 100 = Bayar Full di Muka
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Stok Barang</FormLabel>
            <Input 
              type="number" 
              min="1"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea 
              placeholder="Jelaskan kondisi barang & kelengkapannya..." 
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Foto Barang</FormLabel>
            <Input 
              type="file" 
              accept="image/*"
              pt={1}
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </FormControl>

          <Button 
            colorScheme="blue" 
            size="lg" 
            mt={4} 
            isLoading={uploading}
            loadingText="Mengupload..."
            onClick={handleUpload}
          >
            Upload Barang
          </Button>

        </VStack>
      </Box>
    </Container>
  );
};

export default AddProductPage;