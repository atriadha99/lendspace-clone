// src/pages/LoggedInHomePage.js
import React, { useMemo } from 'react';
import { productData } from '../data/Product';
import ProductRow from '../components/ProductRow'; // Komponen ini akan kita buat

function LoggedInHomePage() {
  // Mengelompokkan produk berdasarkan kategori menggunakan useMemo untuk efisiensi
  const productsByCategory = useMemo(() => {
    return productData.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, []);

  // Ambil produk pertama sebagai hero banner
  const featuredProduct = productData[0];

  return (
    <div className="logged-in-home">
      {/* Hero Banner seperti di Netflix */}
      <div className="hero-banner" style={{backgroundImage: `url(${featuredProduct.imageUrl})`}}>
        <div className="hero-content">
          <h1>{featuredProduct.name}</h1>
          <p>Tersedia untuk disewa mulai dari {featuredProduct.price}</p>
          <button className="cta-button">Lihat Detail</button>
        </div>
      </div>

      {/* Render setiap kategori sebagai baris produk */}
      <div className="rows-container">
        {Object.keys(productsByCategory).map(category => (
          <ProductRow 
            key={category}
            title={category}
            products={productsByCategory[category]}
          />
        ))}
      </div>
    </div>
  );
}

export default LoggedInHomePage;