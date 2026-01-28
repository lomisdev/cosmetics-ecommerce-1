import React, { useState, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './AppBar.css';

const AppBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getFavoriteCount } = useFavorites();
  const cartCount = useMemo(() => getCartCount(), [getCartCount]);
  const favoriteCount = useMemo(() => getFavoriteCount(), [getFavoriteCount]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isProductsPage = useMemo(
    () => location.pathname === '/products' || location.pathname.startsWith('/product'),
    [location.pathname]
  );

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  }, [searchQuery, navigate]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  return (
    <header className="app-bar">
      <div className="app-bar-container">
        {/* Left: Hamburger (only on products page) */}
        {isProductsPage && (
          <button
            type="button"
            className="app-menu-btn"
            aria-label="Open filters"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-products-filters'));
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        {/* Center: Logo + App Name */}
        <Link to="/" className="app-brand">
          <div className="app-logo">
            <span className="logo-text">G</span>
          </div>
          <span className="app-name-text">Glowify</span>
        </Link>

        {/* Spacer */}
        <div className="app-bar-spacer" />

        {/* Right: Search, Cart, Favorites */}
        <div className="app-bar-actions">
          {/* Quick Search */}
          <div className={`app-search ${searchOpen ? 'open' : ''}`}>
            {!searchOpen ? (
              <button
                type="button"
                className="app-search-btn"
                aria-label="Open search"
                onClick={openSearch}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            ) : (
              <form onSubmit={handleSearchSubmit} className="app-search-form">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="app-search-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="app-search-close"
                  aria-label="Close search"
                  onClick={closeSearch}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Favorites */}
          <Link to="/favorites" className="app-action-btn" aria-label="Favorites">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favoriteCount > 0 && <span className="app-action-badge">{favoriteCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="app-action-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="app-action-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
