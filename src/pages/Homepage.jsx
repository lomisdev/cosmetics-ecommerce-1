import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LazyLoad from '../components/LazyLoad';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import './Homepage.css';

// Memoized product section to avoid re-renders
const ProductSection = memo(({ title, products, loading }) => {
  if (loading) {
    return (
      <section className="featured-section">
        <h2>{title}</h2>
        <div className="featured-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card-placeholder" style={{ height: 320, background: '#f0f0f0', borderRadius: 12 }} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <h2>{title}</h2>
      <div className="featured-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} showDiscount />
        ))}
      </div>
    </section>
  );
});

ProductSection.displayName = 'ProductSection';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoized dummy data slices to avoid re-calculating on every render
  const { newArrivals, bestSellers } = useMemo(() => {
    const sorted = [...DUMMY_PRODUCTS];
    return {
      newArrivals: sorted.filter(p => p.isNew).slice(0, 4),
      bestSellers: sorted.filter(p => p.isBestseller).slice(0, 4),
    };
  }, []);

  // Hero banner slides for modern cosmetics shopping
  const heroSlides = [
    {
      title: "Summer Glow Collection",
      subtitle: "Get radiant skin with our new summer essentials",
      cta: "Shop Summer",
      discount: "30% OFF",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)"
    },
    {
      title: "Clean Beauty Revolution",
      subtitle: "Vegan, cruelty-free cosmetics that actually work",
      cta: "Explore Clean Beauty",
      discount: "NEW",
      gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)"
    },
    {
      title: "Limited Edition Drops",
      subtitle: "Exclusive collaborations you won't find anywhere else",
      cta: "Shop Limited",
      discount: "EXCLUSIVE",
      gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
    }
  ];

  // Categories with modern icons and descriptions
  const categories = [
    { name: "Skincare", icon: "🌿", description: "Clean & effective", link: "/products?cat=skincare" },
    { name: "Makeup", icon: "💄", description: "Vibrant & long-lasting", link: "/products?cat=makeup" },
    { name: "Haircare", icon: "💆‍♀️", description: "Healthy & shiny", link: "/products?cat=haircare" },
    { name: "Fragrance", icon: "🌸", description: "Signature scents", link: "/products?cat=fragrance" },
    { name: "Tools", icon: "🖌️", description: "Professional quality", link: "/products?cat=tools" },
    { name: "Body Care", icon: "✨", description: "Pamper yourself", link: "/products?cat=body" }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="homepage">
      {/* === Modern Hero Carousel (Lazy Load) === */}
      <LazyLoad fallback={<div style={{ height: 'clamp(300px, 60vh, 500px)', background: '#f5f5f5' }} />}>
        <section className="hero-carousel" role="banner" aria-label="Hero carousel">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.gradient }}
            >
              <div className="hero-content">
                <div className="hero-badge">{slide.discount}</div>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to="/products" className="hero-btn">{slide.cta}</Link>
              </div>
            </div>
          ))}
          <div className="carousel-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </LazyLoad>

      {/* === Special Offers Banner (Lazy Load) === */}
      <LazyLoad>
        <section className="offers-banner">
          <div className="offer-content">
            <h3>🎁 Join Our Beauty Club</h3>
            <p>Get exclusive offers, early access to new products, and 15% off your first order</p>
            <Link to="/register" className="offer-btn">Join Now</Link>
          </div>
        </section>
      </LazyLoad>

      {/* === Modern Category Grid (Lazy Load) === */}
      <LazyLoad>
        <section className="categories-section">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </LazyLoad>

      {/* === Trust Badges (Lazy Load) === */}
      <LazyLoad>
        <section className="trust-badges">
          <div className="badge-item">
            <span className="badge-icon">🚚</span>
            <div>
              <h4>Free Shipping</h4>
              <p>On orders over $50</p>
            </div>
          </div>
          <div className="badge-item">
            <span className="badge-icon">🔄</span>
            <div>
              <h4>Easy Returns</h4>
              <p>30-day return policy</p>
            </div>
          </div>
          <div className="badge-item">
            <span className="badge-icon">�</span>
            <div>
              <h4>Secure Payment</h4>
              <p>100% secure transactions</p>
            </div>
          </div>
          <div className="badge-item">
            <span className="badge-icon">🌟</span>
            <div>
              <h4>Customer Support</h4>
              <p>24/7 dedicated support</p>
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* === New Arrivals (Lazy Load) === */}
      <LazyLoad>
        <ProductSection title="New Arrivals" products={newArrivals} loading={false} />
      </LazyLoad>

      {/* === Best Sellers (Lazy Load) === */}
      <LazyLoad>
        <ProductSection title="Best Sellers" products={bestSellers} loading={false} />
      </LazyLoad>

      {/* === Quick Stats Bar (Moved to bottom as supporting evidence) === */}
      <LazyLoad>
        <section className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Free</span>
            <span className="stat-label">Shipping Over $50</span>
          </div>
        </section>
      </LazyLoad>
    </div>
  );
};

export default Homepage;
