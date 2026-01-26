import { apiService } from './api';

/**
 * Product API service
 */
export const productService = {
  /**
   * Get all products
   */
  getAll: async () => {
    try {
      return await apiService.get('/products');
    } catch (error) {
      // Fallback to local data if API fails
      const { products } = require('../data/products');
      return products;
    }
  },

  /**
   * Get product by ID
   */
  getById: async (id) => {
    try {
      return await apiService.get(`/products/${id}`);
    } catch (error) {
      // Fallback to local data if API fails
      const { getProductById } = require('../data/products');
      return getProductById(id);
    }
  },

  /**
   * Get products by category
   */
  getByCategory: async (category) => {
    try {
      return await apiService.get(`/products/category/${category}`);
    } catch (error) {
      // Fallback to local data if API fails
      const { getProductsByCategory } = require('../data/products');
      return getProductsByCategory(category);
    }
  },

  /**
   * Search products
   */
  search: async (query) => {
    try {
      return await apiService.get(`/products/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      // Fallback to local data if API fails
      const { searchProducts } = require('../data/products');
      return searchProducts(query);
    }
  },

  /**
   * Create product (admin)
   */
  create: async (productData) => {
    return apiService.post('/products', productData);
  },

  /**
   * Update product (admin)
   */
  update: async (id, productData) => {
    return apiService.put(`/products/${id}`, productData);
  },

  /**
   * Delete product (admin)
   */
  delete: async (id) => {
    return apiService.delete(`/products/${id}`);
  },
};
