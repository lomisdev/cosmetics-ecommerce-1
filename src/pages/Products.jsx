import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import './Products.css';

const Products = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (id) {
          const foundProduct = await productService.getById(id);
          setProduct(foundProduct);
          
          // Get related products (same category, excluding current product)
          if (foundProduct) {
            const allProducts = await productService.getAll();
            const related = allProducts
              .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            setError('Product not found');
          }
        } else {
          // If no ID, show all products
          const allProducts = await productService.getAll();
          setRelatedProducts(allProducts || []);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (id && !product) {
    return (
      <div className="products-container">
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">Browse All Products</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/products" className="btn-primary">Go Back</Link>
      </div>
    );
  }

  if (id && product) {
    // Single product view
    return (
      <div className="product-detail-container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img 
              src={product.image || '/images/products/default-product.jpg'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x600?text=Product+Image';
              }}
            />
          </div>
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-detail-price">
              {product.discount ? (
                <>
                  <span className="original-price">${product.price}</span>
                  <span className="discounted-price">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="discount-badge">-{product.discount}%</span>
                </>
              ) : (
                <span>${product.price}</span>
              )}
            </div>
            <button 
              className="product-detail-btn"
              onClick={() => addToCart(product, 1)}
            >
              Add to Cart
            </button>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Related Products</h2>
            <div className="product-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} showDiscount={true} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Product listing view (fallback - should use ProductListing component)
  return (
    <div className="products-container">
      <h1 className="products-title">Ladies' Products 💄</h1>
      <p className="products-subtitle">Explore our beautiful collection!</p>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} showDiscount={true} />
          ))
        ) : (
          <p className="no-products">No products available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
