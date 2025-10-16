// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productData } from '../data/Product'; // Pastikan nama file data-nya sesuai

function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productData.find(p => p.id === parseInt(id));

  // Default payment method
  const [paymentMethod, setPaymentMethod] = useState('va-bca');

  const handleConfirmPayment = () => {
    alert(`Pembayaran untuk ${product.name} via ${getPaymentLabel(paymentMethod)} sedang diproses.`);
    setTimeout(() => {
      navigate('/payment/verifying'); // atau '/payment/success' tergantung flow-mu
    }, 1500);
  };

  if (!product) return <h2>Produk tidak ditemukan!</h2>;

  // Fungsi bantu buat tampilan alert lebih manusiawi
  const getPaymentLabel = (method) => {
    switch (method) {
      case 'va-bca': return 'BCA Virtual Account';
      case 'va-mandiri': return 'Mandiri Virtual Account';
      case 'gopay': return 'GoPay';
      case 'ovo': return 'OVO';
      case 'cc': return 'Credit/Debit Card';
      default: return 'Unknown';
    }
  };

  return (
    <div className="page-container checkout-layout">
      {/* --- ORDER SUMMARY --- */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-item">
          <img src={product.imageUrl} alt={product.name} />
          <div>
            <h4>{product.name}</h4>
            <p>{product.price} / hari</p>
          </div>
        </div>
        <div className="summary-total">
          <strong>Total</strong>
          <strong>{product.price}</strong>
        </div>
      </div>

      {/* --- PAYMENT SECTION --- */}
      <div className="payment-method">
        <h2>Payment Method</h2>

        <p className="payment-group-title">Virtual Account</p>
        <div
          className={`payment-option ${paymentMethod === 'va-bca' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('va-bca')}
        >
          BCA Virtual Account
        </div>
        <div
          className={`payment-option ${paymentMethod === 'va-mandiri' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('va-mandiri')}
        >
          Mandiri Virtual Account
        </div>

        <p className="payment-group-title">E-Wallet</p>
        <div
          className={`payment-option ${paymentMethod === 'gopay' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('gopay')}
        >
          GoPay
        </div>
        <div
          className={`payment-option ${paymentMethod === 'ovo' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('ovo')}
        >
          OVO
        </div>

        <p className="payment-group-title">Card</p>
        <div
          className={`payment-option ${paymentMethod === 'cc' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('cc')}
        >
          Credit / Debit Card
        </div>

        <button className="cta-button" onClick={handleConfirmPayment}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
