import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { productService } from '../services/productService';
import './Favorites.css';

const Favorites = () => {
  const { favorites, getFavoriteCount } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get all products
        const allProducts = await productService.getAll();
        
        // Filter products that are in favorites
        const filtered = allProducts.filter(product => favorites.includes(product.id));
        setFavoriteProducts(filtered);
      } catch (err) {
        setError(err.message || 'Failed to load favorite products');
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [favorites]);

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <h1>My Favorites</h1>
          <div className="loading-favorites">
            <div className="loading-spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <h1>My Favorites</h1>
          <div className="error-favorites">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Error loading favorites</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <span className="favorites-count">{getFavoriteCount()} items</span>
        </div>
        
        {favoriteProducts.length === 0 ? (
          <div className="empty-favorites">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2>No favorites yet</h2>
            <p>Start adding products to your favorites to see them here!</p>
            <Link to="/products" className="browse-products-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
