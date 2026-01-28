import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { getFavoriteCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const cartCount = getCartCount();
  const favoriteCount = getFavoriteCount();

  const navItems = [
    {
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/products',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Products',
      active: location.pathname === '/products' || location.pathname.startsWith('/product')
    },
    {
      path: '/favorites',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      label: 'Favorites',
      active: location.pathname === '/favorites',
      badge: favoriteCount > 0 ? favoriteCount : null
    },
    {
      path: '/cart',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      label: 'Cart',
      active: location.pathname === '/cart',
      badge: cartCount > 0 ? cartCount : null
    },
    {
      path: isAuthenticated ? '/account' : '/login',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: isAuthenticated ? 'Account' : 'Login',
      active: location.pathname === '/account' || location.pathname === '/login'
    }
  ];

  return (
    <nav className="bottom-navbar" role="navigation" aria-label="Bottom navigation">
      <div className="bottom-navbar-container">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`bottom-nav-item ${item.active ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="nav-icon-wrapper">
              {item.icon}
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
