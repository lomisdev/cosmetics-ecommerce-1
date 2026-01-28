import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Search Products</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="search-input"
              autoFocus
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        
        <div className="search-suggestions">
          <h3>Popular Searches</h3>
          <div className="suggestion-tags">
            {['Lipstick', 'Foundation', 'Mascara', 'Skincare', 'Serum', 'Blush'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="suggestion-tag"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
