import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, FormControl, FormLabel, Input, 
  Textarea, Button, NumberInput, NumberInputField, VStack, 
  Select, useToast, Image, Center
} from '@chakra-ui/react';

const AddProductPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Elektronik',
    deposit_percent: 30 // Default DP 30%
  });

  // Handle Gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !imageFile) {
      toast({ title: "Mohon lengkapi data & foto barang", status: "warning" });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // 1. Upload Gambar
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products') // Pastikan bucket 'products' sudah dibuat & public
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // 2. Simpan Data Produk
      const { error } = await supabase.from('products').insert({
        lender_id: user.id, // Sesuaikan dengan nama kolom di DB Anda (lender_id / user_id)
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        category: form.category,
        image_url: publicUrlData.publicUrl,
        deposit_percent: parseInt(form.deposit_percent),
        status: 'available'
      });

      if (error) throw error;

      toast({ title: "Barang berhasil diiklankan!", status: "success" });
      navigate('/'); // Balik ke Home

    } catch (error) {
      toast({ title: "Gagal upload", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} bg="white" shadow="lg" borderRadius="xl">
        <Heading mb={6}>Sewakan Barang Anda</Heading>

        <VStack spacing={4} align="stretch">
          
          {/* Upload Foto */}
          <FormControl>
            <FormLabel>Foto Barang</FormLabel>
            <Center 
              w="full" h="200px" 
              border="2px dashed gray" 
              borderRadius="md" 
              cursor="pointer"
              flexDirection="column"
              onClick={() => document.getElementById('fileInput').click()}
              bg={preview ? 'gray.100' : 'transparent'}
            >
              {preview ? (
                <Image src={preview} h="100%" objectFit="contain" />
              ) : (
                <Box textAlign="center" color="gray.500">
                  <p>Klik untuk upload foto</p>
                </Box>
              )}
            </Center>
            <Input id="fileInput" type="file" display="none" accept="image/*" onChange={handleImageChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Nama Barang</FormLabel>
            <Input placeholder="Misal: Kamera Canon DSLR" onChange={(e) => setForm({...form, name: e.target.value})} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Harga Sewa (per Hari)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField placeholder="Rp 100.000" onChange={(e) => setForm({...form, price: e.target.value})} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Kategori</FormLabel>
            <Select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
              <option value="Elektronik">Elektronik & Gadget</option>
              <option value="Fotografi">Fotografi</option>
              <option value="Kendaraan">Kendaraan</option>
              <option value="Hobi">Hobi & Olahraga</option>
              <option value="Pakaian">Pakaian / Kostum</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Persentase DP (%)</FormLabel>
            <Select value={form.deposit_percent} onChange={(e) => setForm({...form, deposit_percent: e.target.value})}>
              <option value="0">Tanpa DP (0%)</option>
              <option value="30">30%</option>
              <option value="50">50%</option>
              <option value="100">Bayar Full (100%)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea placeholder="Jelaskan kondisi barang, kelengkapan, dll." onChange={(e) => setForm({...form, description: e.target.value})} />
          </FormControl>

          <Button colorScheme="red" size="lg" onClick={handleSubmit} isLoading={loading}>
            Mulai Sewakan
          </Button>

        </VStack>
      </Box>
    </Container>
  );
};

export default AddProductPage;