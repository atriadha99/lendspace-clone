// src/components/CatalogHeader.js
import React from 'react';
import { Box, Input, Select, Button, ButtonGroup, HStack, VStack } from '@chakra-ui/react'; // <-- TAMBAHKAN VStack DI SINI
// Asumsi Anda juga memiliki CategoryFilter
import CategoryFilter from './CategoryFilter'; 

function CatalogHeader({
  searchTerm, onSearchChange,
  selectedCategory, onCategoryChange,
  sortOrder, onSortChange,
  view, onViewChange
}) {
  return (
    <VStack spacing={6} align="stretch" mb={8}>
      <Input
        placeholder="Cari barang..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onCategoryChange}
      />

      <HStack justify="space-between">
        <Select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          maxW="200px"
        >
          <option value="default">Urutkan</option>
          <option value="price-asc">Harga: Rendah ke Tinggi</option>
          <option value="price-desc">Harga: Tinggi ke Rendah</option>
        </Select>

        <ButtonGroup isAttached>
          <Button onClick={() => onViewChange('grid')} isActive={view === 'grid'}>Grid</Button>
          <Button onClick={() => onViewChange('list')} isActive={view === 'list'}>List</Button>
        </ButtonGroup>
      </HStack>
    </VStack>
  );
}

export default CatalogHeader;