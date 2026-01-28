import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailTest = () => {
  const { id } = useParams();
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Product Detail Test</h1>
      <p>Product ID: {id || 'No ID provided'}</p>
      <p>This is a test to verify the component is rendering.</p>
    </div>
  );
};

export default ProductDetailTest;
