import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import ProductsListing from './ProductsListing';

const Products = () => {
  const { id } = useParams();

  // If there's an ID, show product detail page
  if (id) {
    return <ProductDetail />;
  }

  // Otherwise, show products listing
  return <ProductsListing />;
};

export default Products;
