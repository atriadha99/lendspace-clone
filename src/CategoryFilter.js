// src/CategoryFilter.js
import React from 'react';

const categories = ['All', 'Photography', 'Tools', 'Vehicles', 'Event Gear'];

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;