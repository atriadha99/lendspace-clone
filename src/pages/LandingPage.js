// src/pages/HomePage.js
import React from 'react';
import FeatureCard from '../FeatureCard';
import ContentSections from '../ContentSections';

function LandingPage() {
  return (
    <>
      {/* Bagian Hero */}
      <section className="hero-section">
        <h1>Connect your business with available assets</h1>
        <p>A B2B e-commerce lending platform</p>
        <button className="cta-button">Get started</button>
      </section>

      {/* Bagian "Why Lendspace?" */}
      <section className="content-section">
        <h2>Why Lendspace?</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📦"
            title="Idle inventory"
            description="Monetize unused assets in inventory"
          />
          <FeatureCard
            icon="🤝"
            title="Business coworkers"
            description="Access needed assets without purchasing"
          />
        </div>
      </section>

      {/* Konten dari ContentSections.js */}
      <ContentSections />

      {/* Bagian "Security and Trust" */}
      <section className="content-section">
        <h2>Security and Trust</h2>
        {/* Konten security bisa ditambahkan di sini */}
      </section>
    </>
  );
}

export default LandingPage;