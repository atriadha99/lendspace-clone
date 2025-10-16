// src/pages/ProductDetailPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productData } from '../data/Product';

function ProductDetailPage() {
  const { id } = useParams(); // Mengambil 'id' dari URL (misal: /product/1)
  const navigate = useNavigate(); // Hook untuk navigasi/redirect
  const product = productData.find(p => p.id === parseInt(id));

  // Simulasi proses pembayaran
  const handleRentNow = () => {
    console.log(`Memulai proses pembayaran untuk ${product.name}...`);

    // Di aplikasi nyata, di sini Anda akan memanggil back-end
    // untuk mendapatkan token/URL pembayaran dari Midtrans/Xendit.

    // SIMULASI: Anggap proses berhasil setelah 2 detik
    alert('Anda akan diarahkan ke halaman pembayaran...');
    setTimeout(() => {
      navigate('/payment/success'); // Redirect ke halaman sukses
    }, 2000);
  };

  // Jika produk dengan ID tersebut tidak ditemukan
  if (!product) {
    return <div className="page-container"><h2>Produk tidak ditemukan!</h2></div>;
  }

  return (
    <div className="page-container product-detail-layout">
      <div className="product-detail-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <span className="product-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-price-detail">
          {product.price} <span>{product.priceUnit}</span>
        </p>
        <p className="product-description">
          Deskripsi detail untuk {product.name}. Di sini Anda bisa menambahkan
          spesifikasi, syarat, dan ketentuan sewa.
        </p>
        <button className="cta-button rent-button" onClick={handleRentNow}>
          Sewa Sekarang
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;