import React from 'react';
import './ProductImage.css';

const ProductImage = ({ src, alt, className = '', onLoad, onError }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`product-image ${className}`}
      loading="lazy"
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default ProductImage;
