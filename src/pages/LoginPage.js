// src/pages/LoginPage.js
import React, { useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Dapatkan fungsi login

  const handleLogin = (e) => {
    e.preventDefault();
    // Lakukan validasi... (kita lewati untuk simulasi)

    console.log('Login berhasil!');
    login(); // Ubah status menjadi authenticated
    navigate('/catalog'); // Arahkan ke katalog setelah login
  };

  return (
    <div className="page-container">
      <h1>Login to Lendspace</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input type="email" placeholder="Email Address" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="cta-button">Login</button>
      </form>
    </div>
  );
}
export default LoginPage;