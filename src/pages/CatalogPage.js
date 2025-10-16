// src/pages/CatalogPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { productData } from '../data/Product';
import ProductCard from '../ProductCard';
import CatalogHeader from '../CatalogHeader';

function CatalogPage() {
  const [products] = useState(productData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  // Gunakan useMemo untuk efisiensi, agar filtering & sorting tidak berjalan jika tidak perlu
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') {
          // Hapus 'Rp ' dan '.' lalu ubah ke angka untuk perbandingan
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        }
        if (sortOrder === 'price-desc') {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        }
        return 0; // 'default' order
      });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="page-container">
      <h1>Product Catalog</h1>
      <p>Discover assets you can rent for your business needs.</p>

      <CatalogHeader
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder} onSortChange={setSortOrder}
        view={view} onViewChange={setView}
      />

      {/* Gunakan class dinamis berdasarkan state 'view' */}
      <div className={`product-display ${view}`}>
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <p>No products found matching your criteria.</p>
      )}
    </div>
  );
}
export default CatalogPage;