import React from 'react';

function FeatureCard(props) {
  return (
    <div className="card">
      {/* Menggunakan data dari props */}
      <div className="card-icon">{props.icon}</div>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
}

export default FeatureCard;