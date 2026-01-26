// Application Configuration
export const APP_CONFIG = {
  APP_NAME: 'Glowify',
  APP_VERSION: '1.0.0',
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  CART_STORAGE_KEY: 'cart',
  USER_STORAGE_KEY: 'user',
  PRODUCTS_STORAGE_KEY: 'products',
  SPLASH_DURATION: 1200, // milliseconds
};

// Product Categories
export const CATEGORIES = {
  SKINCARE: 'Skincare',
  MAKEUP: 'Makeup',
  LIPS: 'Lips',
  FRAGRANCE: 'Fragrance',
  HAIRCARE: 'Haircare',
  ACCESSORIES: 'Accessories',
};

// Currency
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'en-US',
};
