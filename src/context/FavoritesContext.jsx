import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add product to favorites
  const addToFavorites = (productId) => {
    if (!favorites.includes(productId)) {
      setFavorites(prev => [...prev, productId]);
      return true; // Return true if added successfully
    }
    return false; // Return false if already in favorites
  };

  // Remove product from favorites
  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
    return true; // Return true if removed successfully
  };

  // Check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
      return false; // Now not favorite
    } else {
      addToFavorites(productId);
      return true; // Now favorite
    }
  };

  // Get favorite count
  const getFavoriteCount = () => {
    return favorites.length;
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoriteCount,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
