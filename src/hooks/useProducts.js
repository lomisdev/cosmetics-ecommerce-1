import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

/**
 * Custom hook for product operations
 * @param {Object} options - Options for filtering/searching
 * @returns {Object} - Products data and operations
 */
export const useProducts = (options = {}) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedProducts = [];

        if (options.category) {
          fetchedProducts = await productService.getByCategory(options.category);
        } else if (options.searchTerm) {
          fetchedProducts = await productService.search(options.searchTerm);
        } else if (options.limit) {
          const allProducts = await productService.getAll();
          fetchedProducts = allProducts.slice(0, options.limit);
        } else {
          fetchedProducts = await productService.getAll();
        }

        setProductList(fetchedProducts || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.category, options.searchTerm, options.limit]);

  const getProduct = async (id) => {
    try {
      return await productService.getById(id);
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  return {
    products: productList,
    loading,
    error,
    getProduct,
    total: productList.length,
  };
};
