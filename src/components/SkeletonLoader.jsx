import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    );
  }

  if (type === 'product-grid') {
    return (
      <div className="skeleton-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return <div className="skeleton-text"></div>;
  }

  if (type === 'button') {
    return <div className="skeleton-button"></div>;
  }

  return <div className="skeleton-default"></div>;
};

export default SkeletonLoader;
