// src/pages/PaymentGatewayPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentGatewayPage() {
  const { state } = useLocation(); // Ambil data produk dari state navigasi
  const navigate = useNavigate();

  const handlePay = () => {
    // Simulasi pembayaran berhasil
    navigate('/payment/verifying');
  };

  if (!state || !state.product) return <p>Data pesanan tidak valid.</p>;

  return (
    <div className="gateway-page">
      <h2>Lendspace Secure Payment</h2>
      <p>Anda akan membayar untuk: <strong>{state.product.name}</strong></p>
      <h3>Total: {state.product.price}</h3>
      <button onClick={handlePay} className="cta-button">Bayar Sekarang</button>
    </div>
  );
}
export default PaymentGatewayPage;