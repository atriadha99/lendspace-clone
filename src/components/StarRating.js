// src/components/StarRating.js
import React from 'react';

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>⭐</span>)}
      {halfStar && <span>🌟</span>} {/* Simbol bintang berbeda untuk setengah */}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`}>☆</span>)}
    </div>
  );
}

export default StarRating;