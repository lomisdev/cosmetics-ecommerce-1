import { apiService } from './api';
import { storage } from '../utils/storage';

/**
 * Authentication API service
 */
export const authService = {
  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', { email, password });
    
    if (response.token) {
      storage.set('authToken', response.token);
      storage.set('user', response.user);
    }
    
    return response;
  },

  /**
   * Register user
   */
  register: async (userData) => {
    const response = await apiService.post('/auth/register', userData);
    
    if (response.token) {
      storage.set('authToken', response.token);
      storage.set('user', response.user);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: () => {
    storage.remove('authToken');
    storage.remove('user');
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return storage.get('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!storage.get('authToken');
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return storage.get('authToken');
  },
};
