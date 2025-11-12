// src/components/ServicesWidget.js
import React, { useState } from 'react';

// Adapted for a rental platform
const TABS = ["Sewa Cepat", "Barang Populer", "Deposit", "Bantuan"];

function ServicesWidget() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className="services-widget">
      <div className="widget-tabs">
        {TABS.map(tab => (
          <button 
            key={tab} 
            className={`widget-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="widget-content">
        {activeTab === "Sewa Cepat" && (
          <div className="widget-pane">
            <input type="text" placeholder="Cari barang yang ingin disewa..." />
            <button className="cta-button">Cari</button>
          </div>
        )}
        {/* Add content for other tabs here if needed */}
      </div>
    </section>
  );
}

export default ServicesWidget;