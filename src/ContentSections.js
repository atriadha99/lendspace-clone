// src/ContentSections.js
import React from 'react';
import SectionItem from './SectionItem';

function ContentSections() {
  // Data untuk bagian "How It Works"
  const howItWorksItems = [
    { icon: '🔍', title: 'Browse items near you' },
    { icon: '💬', title: 'Connect and lend safely' },
    { icon: '$', title: 'Earn or rent instantly' },
  ];

  // Data untuk kategori produk
  const categoryItems = [
    { icon: '📷', title: 'Photography' },
    { icon: '🔧', title: 'Tools' },
    { icon: '🚗', title: 'Vehicles' },
    { icon: '🎬', title: 'Event Gear' },
  ];

  return (
    <>
      {/* Bagian How It Works */}
      <section className="content-section">
        <h2>How It Works</h2>
        <div className="items-grid">
          {howItWorksItems.map((item) => (
            <SectionItem key={item.title} icon={item.icon} title={item.title} />
          ))}
        </div>
      </section>

      {/* Bagian Kategori Produk */}
      <section className="content-section">
        {/* Judul untuk kategori bisa ditambahkan jika perlu */}
        <div className="items-grid-categories">
          {categoryItems.map((item) => (
            <SectionItem key={item.title} icon={item.icon} title={item.title} />
          ))}
        </div>
      </section>
    </>
  );
}

export default ContentSections;