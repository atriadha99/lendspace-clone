// src/pages/PaymentVerificationPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentVerificationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulasi proses verifikasi selama 3 detik
    const timer = setTimeout(() => {
      navigate('/payment/success');
    }, 3000);

    // Cleanup timer jika komponen unmount sebelum waktunya
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page-container">
      <h1>⏳ Verifying Your Payment...</h1>
      <p>Please wait, we are confirming your transaction. Do not close this page.</p>
    </div>
  );
}

export default PaymentVerificationPage;