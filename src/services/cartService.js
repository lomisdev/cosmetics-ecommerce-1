import { apiService } from './api';
import { storage } from '../utils/storage';
import { APP_CONFIG } from '../constants/config';

/**
 * Cart API service
 */
export const cartService = {
  /**
   * Get user's cart from API
   */
  getCart: async () => {
    try {
      return await apiService.get('/cart');
    } catch (error) {
      // Fallback to local storage if API fails
      return storage.get(APP_CONFIG.CART_STORAGE_KEY, []);
    }
  },

  /**
   * Add item to cart via API
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      return await apiService.post('/cart/add', { productId, quantity });
    } catch (error) {
      // Fallback to local storage
      const cart = storage.get(APP_CONFIG.CART_STORAGE_KEY, []);
      const existingItem = cart.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }
      
      storage.set(APP_CONFIG.CART_STORAGE_KEY, cart);
      return cart;
    }
  },

  /**
   * Update cart item via API
   */
  updateCartItem: async (itemId, quantity) => {
    try {
      return await apiService.put(`/cart/update/${itemId}`, { quantity });
    } catch (error) {
      // Fallback to local storage
      const cart = storage.get(APP_CONFIG.CART_STORAGE_KEY, []);
      const item = cart.find(item => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        storage.set(APP_CONFIG.CART_STORAGE_KEY, cart);
      }
      return cart;
    }
  },

  /**
   * Remove item from cart via API
   */
  removeFromCart: async (itemId) => {
    try {
      return await apiService.delete(`/cart/remove/${itemId}`);
    } catch (error) {
      // Fallback to local storage
      const cart = storage.get(APP_CONFIG.CART_STORAGE_KEY, []);
      const filtered = cart.filter(item => item.id !== itemId);
      storage.set(APP_CONFIG.CART_STORAGE_KEY, filtered);
      return filtered;
    }
  },

  /**
   * Clear cart via API
   */
  clearCart: async () => {
    try {
      await apiService.delete('/cart/clear');
    } catch (error) {
      // Fallback to local storage
      storage.set(APP_CONFIG.CART_STORAGE_KEY, []);
    }
  },
};
