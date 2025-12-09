import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { storage } from '../lib/appwrite';

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);



const uploadKTP = async (file) => {
  const response = await storage.createFile('ktp_bucket', ID.unique(), file);
  // simpan response.$id ke users.ktp_url
};

  // --- Simulasi data user (sementara bisa ganti ke API) ---
  useEffect(() => {
    const dummyUser = {
      name: "Dika Dhaniska",
      username: "@dika.dev",
      email: "dika@example.com",
      phone: "08123456789",
      address: "Bandung, Jawa Barat",
      balance: 250000,
      rating: 4.8,
      joined: "Maret 2024",
      profilePic: "https://i.pravatar.cc/150?img=12",
      items: [
        {
          name: "Kamera Canon EOS 80D",
          price: "Rp 150.000 / hari",
          status: "Available",
        },
        {
          name: "Tripod Carbon Fiber",
          price: "Rp 50.000 / hari",
          status: "Rented",
        },
      ],
      transactions: [
        {
          id: "#TX1234",
          item: "Lensa 50mm f/1.8",
          date: "12 Okt 2025",
          status: "Selesai",
        },
        {
          id: "#TX1241",
          item: "Lighting Kit",
          date: "10 Okt 2025",
          status: "Berlangsung",
        },
      ],
    };

    setTimeout(() => setUserData(dummyUser), 700);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!userData) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <img
          src={userData.profilePic}
          alt={userData.name}
          className="profile-pic"
        />

        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p className="username">{userData.username}</p>
          <p>{userData.email}</p>
          <p>{userData.phone}</p>
          <p>{userData.address}</p>
          <div className="rating">
            ⭐ {userData.rating} <span>• Bergabung {userData.joined}</span>
          </div>
        </div>

        <div className="balance-card">
          <h4>Saldo</h4>
          <p>Rp {userData.balance.toLocaleString()}</p>
          <button className="withdraw-btn">Tarik Dana</button>
        </div>
      </div>

      {/* Item Section */}
      <div className="section">
        <h3>Barang yang Disewakan</h3>
        <div className="item-list">
          {userData.items.map((item, index) => (
            <div key={index} className="item-card">
              <h4>{item.name}</h4>
              <p>{item.price}</p>
              <span
                className={`status ${
                  item.status === "Available" ? "available" : "rented"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Section */}
      <div className="section">
        <h3>Riwayat Transaksi</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Barang</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userData.transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.id}</td>
                <td>{tx.item}</td>
                <td>{tx.date}</td>
                <td
                  className={`status ${
                    tx.status === "Selesai" ? "done" : "ongoing"
                  }`}
                >
                  {tx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <button className="cta-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
