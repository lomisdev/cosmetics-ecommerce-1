import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, showDiscount = false }) => {
  const { addToCart } = useCart();

  if (!product || !product.id) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && product.id) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="product-card">
      {showDiscount && product.discount && (
        <div className="discount-tag">-{product.discount}%</div>
      )}
      <Link to={`/product/${product.id}`} className="product-card-link">
        <img
          src={product.image || '/images/products/default-product.jpg'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x300?text=Product+Image';
          }}
        />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          {product.discount ? (
            <>
              <span className="original-price">${product.price}</span>
              <span className="discounted-price">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            `$${product.price}`
          )}
        </p>
      </Link>
      <button className="product-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
