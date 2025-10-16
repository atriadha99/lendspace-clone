// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Daftar bank untuk dropdown
const bankOptions = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Danamon'];

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user');
  const [idCard, setIdCard] = useState(null);
  const [selectedBank, setSelectedBank] = useState(bankOptions[0]);
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) setIdCard(e.target.files[0]);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const userData = { fullName, email, phone, password, accountType };

    if (accountType === 'lender') {
      userData.bank = selectedBank;
      userData.bankAccountNumber = bankAccountNumber;
      userData.idCardName = idCard ? idCard.name : 'No file uploaded';
    }

    console.log('Registering new account with data:', userData);
    alert(`Akun ${accountType} untuk ${fullName} berhasil dibuat!`);
  };

  return (
    <div className="page-container">
      <h1>Create Your Lendspace Account</h1>

      <form className="register-form" onSubmit={handleRegister}>
        {/* Pilihan tipe akun */}
        <label>Account Type</label>
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="user">User</option>
          <option value="lender">Lender</option>
        </select>

        {/* Data umum */}
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="081234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Create Password</label>
        <input
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Jika akun lender */}
        {accountType === 'lender' && (
          <div className="lender-verification-section">
            <h3>Lender Verification</h3>
            <p>Please provide additional information to verify your account.</p>

            <label>Upload ID Card (KTP)</label>
            <input type="file" className="file-input" onChange={handleFileChange} required />

            <label>Bank Name</label>
            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>

            <label>Bank Account Number</label>
            <input
              type="text"
              placeholder="For receiving rental payments"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="cta-button">
          Create Account
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
