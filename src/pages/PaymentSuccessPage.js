// src/pages/PaymentSuccessPage.js
import { Link } from 'react-router-dom';
function PaymentSuccessPage() {
  return (
    <div className="page-container">
      <h1>✅ Pembayaran Berhasil!</h1>
      <p>Terima kasih telah melakukan transaksi di Lendspace.</p>
      <Link to="/catalog">Kembali ke Katalog</Link>
    </div>
  );
}
export default PaymentSuccessPage;