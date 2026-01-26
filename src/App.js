import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { App as CapacitorApp } from '@capacitor/app';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ProductListing from './pages/ProductListing';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import FAQ from './pages/FAQ';
import ShippingReturns from './pages/ShippingReturns';
import AccountAuth from './components/AccountAuth';
import Products from './pages/Products';
import AdminPanel from './pages/AdminPanel';
import './App.css';
import logo from './glowify.gif';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // respect user preference for reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsLoading(false);
      return;
    }

    // shorter splash on mobile — doesn't block the user too long
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // The back button-ensure user doesn't get logged out prematurely
  useEffect(() => {
    // Only set up listener if Capacitor is available (native app)
    if (typeof CapacitorApp !== 'undefined' && CapacitorApp.addListener) {
      const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (window.location.pathname === '/login') {
          CapacitorApp.minimizeApp();
        } else if (canGoBack) {
          window.history.back();
        } else {
          CapacitorApp.minimizeApp();
        }
      });

      return () => {
        // Only remove if listener exists and has remove method
        if (backButtonListener && typeof backButtonListener.remove === 'function') {
          backButtonListener.remove();
        }
      };
    }
    // No cleanup needed if Capacitor is not available
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              {isLoading ? (
                // === Splash Screen ===
                <div
                  className="splash-screen splash-full"
                  style={{ backgroundImage: `url(${logo})` }}
                >
                  <div className="splash-overlay">
                    <h1 className="splash-text">Glowify</h1>
                  </div>
                </div>
              ) : (
                // === Main App ===
                <div className="app fade-in">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/products" element={<ProductListing />} />
                      <Route path="/product/:id" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping-returns" element={<ShippingReturns />} />
                      <Route path="/account" element={<AccountAuth />} />
                      <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              )}

            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;