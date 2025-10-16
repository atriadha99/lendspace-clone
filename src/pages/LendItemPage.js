// src/pages/LendItemPage.js
import React, { useState } from 'react';

function LendItemPage() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Photography');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Barang "${itemName}" dalam kategori "${category}" berhasil didaftarkan!`);
    // Di aplikasi nyata, data ini akan dikirim ke back-end
  };

  return (
    <div className="page-container">
      <h1>Lend Your Item</h1>
      <p>Fill out the form below to list your item on Lendspace.</p>
      <form className="lend-form" onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} required />

        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Photography</option>
          <option>Tools</option>
          <option>Vehicles</option>
          <option>Event Gear</option>
        </select>

        <label>Rental Price (per day)</label>
        <input type="text" placeholder="e.g., Rp 150.000" required />

        <label>Image URL</label>
        <input type="text" placeholder="https://..." required />

        <button type="submit" className="cta-button">List My Item</button>
      </form>
    </div>
  );
}
export default LendItemPage;