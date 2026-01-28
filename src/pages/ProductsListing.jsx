import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import './ProductsListing.css';

const ProductsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handler = () => {
      setIsFiltersOpen((v) => !v);
    };

    window.addEventListener('toggle-products-filters', handler);
    return () => {
      window.removeEventListener('toggle-products-filters', handler);
    };
  }, []);
  
  // Get URL parameters
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');
  const urlSort = searchParams.get('sort');
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlInStock = searchParams.get('inStock') === 'true';
  
  // Initialize from URL parameters
  useEffect(() => {
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlSort) setSortBy(urlSort);
    if (urlMinPrice || urlMaxPrice) {
      const min = Number(urlMinPrice);
      const max = Number(urlMaxPrice);
      setPriceRange([
        Number.isFinite(min) ? min : 0,
        Number.isFinite(max) ? max : 1000,
      ]);
    }
    if (urlInStock) setInStockOnly(true);
  }, [urlCategory, urlSearch, urlSort, urlMinPrice, urlMaxPrice, urlInStock, setCategory, setSearchQuery, setSortBy, setPriceRange, setInStockOnly]);

  // Fetch products
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        try {
          let filteredProducts = DUMMY_PRODUCTS;
          
          // Apply filters
          // Category filter
          if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
              product.category === category
            );
          }
          
          // Search filter
          if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
              product.name.toLowerCase().includes(searchLower) ||
              product.category.toLowerCase().includes(searchLower) ||
              product.description?.toLowerCase().includes(searchLower)
            );
          }
          
          // Price range filter
          filteredProducts = filteredProducts.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
          );
          
          // Stock filter
          if (inStockOnly) {
            filteredProducts = filteredProducts.filter(product => product.inStock);
          }
          
          // Sort products
          const sortedProducts = [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
              case 'price-low-high':
                return a.price - b.price;
              case 'price-high-low':
                return b.price - a.price;
              case 'newest':
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
              case 'oldest':
                return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
              case 'rating':
                return (b.rating || 0) - (a.rating || 0);
              case 'featured':
                return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
              default:
                return 0;
            }
          });
          
          setProducts(sortedProducts);
        } catch (err) {
          setProducts([]);
        } finally {
          setLoading(false);
        }
      }, 300); // Simulate network delay
    };

    loadProducts();
  }, [category, debouncedSearch, sortBy, priceRange, inStockOnly]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    
    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.set('minPrice', priceRange[0]);
      params.set('maxPrice', priceRange[1]);
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }
    
    if (inStockOnly) {
      params.set('inStock', 'true');
    } else {
      params.delete('inStock');
    }

    setSearchParams(params, { replace: true });
  }, [category, searchQuery, sortBy, priceRange, inStockOnly, setSearchParams]);

  // Filter options
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(DUMMY_PRODUCTS.map((p) => p.category).filter(Boolean))
    );
    const cats = ['all', ...unique];
    return cats.map((cat) => ({
      value: cat,
      label: cat === 'all' ? 'All' : cat,
    }));
  }, []);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const priceRanges = [
    { value: [0, 50], label: 'Under $50' },
    { value: [50, 100], label: '$50 - $100' },
    { value: [100, 200], label: '$100 - $200' },
    { value: [200, 500], label: '$200 - $500' },
    { value: [500, 1000], label: '$500 - $1000' },
    { value: [1000, 5000], label: '$1000 - $5000' },
  ];

  const viewModes = [
    { value: 'grid', label: 'Grid View', icon: 'grid' },
    { value: 'list', label: 'List View', icon: 'list' },
  ];

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'category':
        setCategory(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'priceRange':
        setPriceRange(value);
        break;
      case 'inStockOnly':
        setInStockOnly(value);
        break;
      case 'viewMode':
        setViewMode(value);
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled by debouncedSearch
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('featured');
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setViewMode('grid');
    navigate('/products', { replace: true });
  };

  const getFilterCount = () => {
    let count = 0;
    if (category !== 'all') count++;
    if (searchQuery) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (inStockOnly) count++;
    return count;
  };

  const activeFiltersCount = getFilterCount();

  return (
    <div className="products-listing-page">
      <div
        className={`products-filters-overlay ${isFiltersOpen ? 'open' : ''}`}
        onClick={() => setIsFiltersOpen(false)}
      />
      <aside
        className={`products-filters-drawer ${isFiltersOpen ? 'open' : ''}`}
        aria-hidden={!isFiltersOpen}
      >
        <div className="products-filters-header">
          <div className="products-filters-title">Filters</div>
          <button
            type="button"
            className="products-filters-close"
            aria-label="Close filters"
            onClick={() => setIsFiltersOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="products-filters-body">
          <div className="products-filters-section">
            <label htmlFor="category-filter" className="filter-label">Category</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filters-section">
            <label htmlFor="sort-filter" className="filter-label">Sort</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filters-section">
            <label htmlFor="price-filter" className="filter-label">Price</label>
            <select
              id="price-filter"
              value={`${priceRange[0]}-${priceRange[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                handleFilterChange('priceRange', [min, max]);
              }}
              className="filter-select"
            >
              {priceRanges.map((range) => (
                <option key={`${range.value}`} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filters-section">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                id="stock-filter"
                checked={inStockOnly}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
              />
              <label htmlFor="stock-filter" className="filter-checkbox-label">
                In Stock Only
              </label>
            </label>
          </div>

          <div className="products-filters-section">
            <div className="products-filters-subtitle">View</div>
            <div className="products-filters-view">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => handleFilterChange('viewMode', mode.value)}
                  className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
                >
                  <span className="view-mode-icon">{mode.icon}</span>
                  <span className="view-mode-label">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="products-filters-section">
            <button
              type="button"
              onClick={clearFilters}
              className="clear-filters-btn"
              disabled={activeFiltersCount === 0}
            >
              Clear All Filters
            </button>
            <div className="active-filters-count">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
            </div>
          </div>
        </div>
      </aside>

      {/* Search Bar */}
      <div className="products-search">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>
          {products.length} {products.length === 1 ? 'product' : 'products'} found
          {activeFiltersCount > 0 && ` with ${activeFiltersCount} active filter${activeFiltersCount === 1 ? '' : 's'}`}
        </p>
      </div>


      {/* Products Grid/List */}
      {loading ? (
        <SkeletonLoader type="product-grid" />
      ) : products.length > 0 ? (
        <div className={`products-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} showDiscount={true} />
          ))}
        </div>
      ) : (
        <div className="no-products-container">
          <div className="no-products">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsListing;
