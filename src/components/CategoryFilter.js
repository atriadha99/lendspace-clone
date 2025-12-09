// src/components/CategoryFilter.js
import React from 'react';
import { Button, HStack } from '@chakra-ui/react';

// Definisikan kategori di sini. "All" penting untuk reset filter.
const categories = ['All', 'Photography', 'Tools', 'Vehicles', 'Event Gear', 'Electronics', 'Fashion', 'Books'];

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    // HStack dengan overflowX="auto" akan membuat barisan ini bisa di-scroll
    // secara horizontal di layar kecil, persis seperti di Tokopedia.
    <HStack 
      spacing={2} 
      overflowX="auto" 
      pb={2} // Padding di bawah untuk ruang scrollbar
      w="100%"
    >
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory(category)}
          // 'isActive' adalah prop Chakra untuk style tombol aktif
          isActive={selectedCategory === category}
          colorScheme="red"
          // Ganti variant agar yang aktif terlihat 'solid'
          variant={selectedCategory === category ? 'solid' : 'outline'}
          // Mencegah tombol menyusut saat di dalam HStack
          flexShrink={0} 
        >
          {category}
        </Button>
      ))}
    </HStack>
  );
}

export default CategoryFilter;