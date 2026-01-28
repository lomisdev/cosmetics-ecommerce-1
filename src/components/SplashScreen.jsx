import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash for minimum 2 seconds, then fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Completely remove splash after fade out
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="splash-overlay">
        <div className="splash-content">
          {/* Logo Animation */}
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">G</span>
            </div>
            <div className="logo-ring"></div>
            <div className="logo-ring ring-2"></div>
            <div className="logo-ring ring-3"></div>
          </div>
          
          {/* Brand Name */}
          <h1 className="brand-name">
            <span className="brand-letter">G</span>
            <span className="brand-letter">l</span>
            <span className="brand-letter">o</span>
            <span className="brand-letter">w</span>
            <span className="brand-letter">i</span>
            <span className="brand-letter">f</span>
            <span className="brand-letter">y</span>
          </h1>
          
          {/* Tagline */}
          <p className="tagline">Beauty Redefined</p>
          
          {/* Loading Dots */}
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
