import React, { useState, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductCard.css';

const ProductCard = memo(({ product, showDiscount = false }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = useMemo(
    () => (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (product && product.id) {
        addToCart(product, 1);
      }
    },
    [addToCart, product]
  );

  const handleToggleFavorite = useMemo(
    () => (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (product && product.id) {
        setIsAnimating(true);
        toggleFavorite(product.id);
        setTimeout(() => setIsAnimating(false), 300);
      }
    },
    [toggleFavorite, product]
  );

  const imageSrc = useMemo(() => {
    const base = product.image || '/images/products/default-product.jpg';
    // Simple WebP/AVIF fallback could be added here
    return base;
  }, [product.image]);

  if (!product || !product.id) {
    return null;
  }

  return (
    <div className="product-card">
      {showDiscount && product.discount && (
        <div className="discount-tag">-{product.discount}%</div>
      )}
      
      {/* Favorite Button */}
      <button
        className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleToggleFavorite}
        aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className={`product-image-container ${imageLoaded ? 'loaded' : ''}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x300?text=Product+Image';
              setImageLoaded(true);
            }}
          />
        </div>
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
