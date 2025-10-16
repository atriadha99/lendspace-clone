// src/CatalogHeader.js
import React from 'react';
import CategoryFilter from './CategoryFilter';

function CatalogHeader({
  searchTerm, onSearchChange,
  selectedCategory, onCategoryChange,
  sortOrder, onSortChange,
  view, onViewChange
}) {
  return (
    <div className="catalog-header">
      <input
        type="text"
        placeholder="Search for an item..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onCategoryChange}
      />
      <div className="catalog-controls-bottom">
        <select className="sort-dropdown" value={sortOrder} onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="view-toggle">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => onViewChange('grid')}>Grid</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => onViewChange('list')}>List</button>
        </div>
      </div>
    </div>
  );
}

export default CatalogHeader;