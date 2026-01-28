import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      if (cancelled) return;

      try {
        const productId = parseInt(id, 10);
        const productData = DUMMY_PRODUCTS.find((p) => p.id === productId);

        if (productData) {
          setProduct(productData);

          const related = DUMMY_PRODUCTS
            .filter((p) => p.category === productData.category && p.id !== productData.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setError('Product not found');
          setProduct(null);
        }
      } catch (err) {
        setError('Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, 1);
      showToast(`${product.name} added to cart!`, 'success', 3000);
    } catch (err) {
      showToast('Failed to add to cart', 'error', 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading product...</h2>
        <p>Please wait while we fetch the product details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ color: '#e91e63' }}>Error Loading Product</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/products')} 
          style={{ 
            padding: '10px 20px', 
            background: '#e91e63', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ color: '#e91e63' }}>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/products')} 
          style={{ 
            padding: '10px 20px', 
            background: '#e91e63', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Product Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/products')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#666', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Products
        </button>
        <span style={{ color: '#999' }}>|</span>
        <span>Product Details</span>
      </div>

      {/* Product Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Left Column - Product Image */}
        <div>
          <div style={{ 
            width: '100%', 
            height: 'clamp(260px, 60vw, 420px)', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <img 
              src={product.image || 'https://placehold.co/400x400?text=Product+Image'} 
              alt={product.name}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x400?text=Product+Image';
              }}
            />
          </div>
          
          {/* Product Badges */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {product.isNew && (
              <span style={{ 
                background: '#4caf50', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                NEW
              </span>
            )}
            {product.isBestseller && (
              <span style={{ 
                background: '#ff9800', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                BESTSELLER
              </span>
            )}
            {product.discount && (
              <span style={{ 
                background: '#f44336', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#333' }}>{product.name}</h1>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ color: '#ffc107' }}>
              {'★'.repeat(Math.floor(product.rating || 0))}
              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
            </div>
            <span style={{ color: '#666' }}>{product.rating || 0}.0</span>
            <span style={{ color: '#999' }}>({product.reviewCount || 0} reviews)</span>
          </div>

          {/* Category */}
          <p style={{ color: '#666', marginBottom: '15px', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
            {product.category}
          </p>

          {/* Price */}
          <div style={{ marginBottom: '20px' }}>
            {product.discount ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ 
                  textDecoration: 'line-through', 
                  color: '#999', 
                  fontSize: '1.2rem' 
                }}>
                  ${product.price}
                </span>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#e91e63' 
                }}>
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                ${product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '20px' }}>
            {product.inStock ? (
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Description</h3>
            <p style={{ lineHeight: '1.6', color: '#666' }}>{product.description}</p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Key Features</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              color: '#666',
              lineHeight: '1.8'
            }}>
              {(product.features || []).map((feature, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{ 
                padding: '12px 24px', 
                background: product.inStock ? '#e91e63' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              onClick={() => navigate('/products')}
              style={{ 
                padding: '12px 24px', 
                background: '#666', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>You May Also Like</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            {relatedProducts.map(relatedProduct => (
              <div 
                key={relatedProduct.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div style={{ 
                  height: '150px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '5px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={relatedProduct.image || 'https://placehold.co/150x150?text=Product'} 
                    alt={relatedProduct.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'cover',
                      borderRadius: '5px'
                    }}
                  />
                </div>
                <h3 style={{ fontSize: '16px', marginBottom: '5px', color: '#333' }}>{relatedProduct.name}</h3>
                <p style={{ color: '#666', marginBottom: '5px' }}>{relatedProduct.category}</p>
                {relatedProduct.discount ? (
                  <div>
                    <span style={{ 
                      textDecoration: 'line-through', 
                      color: '#999', 
                      fontSize: '14px' 
                    }}>
                      ${relatedProduct.price}
                    </span>
                    <span style={{ 
                      color: '#e91e63', 
                      fontWeight: 'bold', 
                      fontSize: '16px' 
                    }}>
                      ${(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span style={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                    ${relatedProduct.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
