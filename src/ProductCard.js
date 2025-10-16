// src/ProductCard.js
import { Link } from 'react-router-dom';

function ProductCard({ product, view }) { // Tambahkan prop 'view'
  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      {/* Tambahkan class dinamis 'list-view' */}
      <div className={`product-card ${view === 'list' ? 'list-view' : ''}`}>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">
            {product.price} <span className="price-unit">{product.priceUnit}</span>
          </p>
          {/* Deskripsi ini hanya akan terlihat di mode list */}
          <p className="product-description-list">
            Deskripsi singkat untuk {product.name}. Cocok untuk berbagai kebutuhan Anda.
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;