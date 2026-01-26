import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts } from '../hooks';
import './Homepage.css';
import logo from '../assets/back.png';

const Homepage = () => {
  // Get featured products (first 4 products) from API
  const { products: featuredProducts, loading } = useProducts({ limit: 4 });

  return (
    <div className="homepage">
      {/* === Hero Section (Gradient Background) === */}
      <section className="hero-banner" role="banner" aria-label="Hero banner">
        <div className="hero-content">
          <h1>Unleash Your <span>Glow</span></h1>
          <p>Exclusive beauty deals and top-rated cosmetics — just for you!</p>
          <Link to="/products" className="hero-btn" aria-label="Shop Now — Glowify">Shop Now</Link>
        </div>
      </section>

      {/* === Header Section === */}
      <header className="homepage-header">
        <div className="logo-container">
          <img src={logo} alt="Glowify Logo" className="glowify-logo" loading="lazy" />
        </div>
        <div className="header-text">
          <h1>Welcome to <span>Glowify</span></h1>
          <p>Discover premium cosmetics that bring out your natural beauty.</p>
          <Link to="/products" className="shop-btn">Explore All</Link>
        </div>
      </header>

      {/* === Category Shortcuts === */}
      <section className="category-bar">
        <Link to="/products?cat=skincare">💧 Skincare</Link>
        <Link to="/products?cat=makeup">💄 Makeup</Link>
        <Link to="/products?cat=fragrance">🌸 Fragrance</Link>
        <Link to="/products?cat=haircare">💇 Haircare</Link>
        <Link to="/products?cat=accessories">👜 Accessories</Link>
      </section>

      {/* === Featured Products Section === */}
      <section className="featured-section">
        <h2>✨ Featured Products</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="product-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} showDiscount={true} />
              ))
            ) : (
              <p>No featured products available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Homepage;
