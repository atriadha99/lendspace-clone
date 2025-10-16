// src/components/ProductRow.js
import React from 'react';
import ProductCard from '../ProductCard'; // Kita gunakan ulang ProductCard

function ProductRow({ title, products }) {
  return (
    <section className="product-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-items">
        {products.map(product => (
          <div className="row-item-wrapper" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductRow;