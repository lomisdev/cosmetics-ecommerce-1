import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductListing.css';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const category = searchParams.get('cat');
  const searchQuery = searchParams.get('search');
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let products = [];
        
        if (category) {
          products = await productService.getByCategory(category);
        } else if (searchQuery) {
          products = await productService.search(searchQuery);
        } else if (debouncedSearch) {
          products = await productService.search(debouncedSearch);
        } else {
          products = await productService.getAll();
        }
        
        setFilteredProducts(products || []);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, debouncedSearch]);

  return (
    <div className="product-listing-container">
      <h1 className="listing-title">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
      </h1>
      
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="no-products">Error: {error}</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
