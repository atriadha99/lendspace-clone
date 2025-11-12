import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productData } from '../data/products';
import ProductCard from '../components/ProductCard';
import CatalogHeader from '../CatalogHeader';

function CatalogPage() {
  // --- ambil semua produk ---
  const [products] = useState(productData);
  const [searchParams] = useSearchParams();

  // --- ambil nilai dari query URL ---
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOrder, setSortOrder] = useState('default');
  const [view, setView] = useState('grid'); // grid / list

  // --- filter & sort produk pakai useMemo biar efisien ---
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        }
        if (sortOrder === 'price-desc') {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        }
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="catalog-page">
      <h1 className="page-title">Katalog Produk</h1>
      <p className="page-subtitle">Temukan aset terbaik untuk disewa sesuai kebutuhanmu.</p>

      {/* 🔍 Header kontrol filter, pencarian, dan tampilan */}
      <CatalogHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        view={view}
        onViewChange={setView}
      />

      {/* 🧱 Tampilan produk */}
      <div className={`product-display ${view}`}>
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} view={view} />
          ))
        ) : (
          <p className="no-results">Tidak ada produk yang cocok dengan pencarianmu.</p>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
