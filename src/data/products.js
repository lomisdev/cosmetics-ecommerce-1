// Centralized product data
// This can be replaced with API calls later

export const products = [
  {
    id: 1,
    name: 'Rose Lip Balm',
    price: 15,
    category: 'Lips',
    image: '/images/products/rose-lip-balm.jpg',
    discount: 20,
    description: 'Moisturizing lip balm with rose extract for soft, hydrated lips.',
    inStock: true,
    stock: 50,
  },
  {
    id: 2,
    name: 'Hydrating Serum',
    price: 25,
    category: 'Skincare',
    image: '/images/products/hydrating-serum.jpg',
    discount: 35,
    description: 'Deep hydrating serum for glowing, radiant skin.',
    inStock: true,
    stock: 30,
  },
  {
    id: 3,
    name: 'Glow Foundation',
    price: 30,
    category: 'Makeup',
    image: '/images/products/glow-foundation.jpg',
    discount: 40,
    description: 'Lightweight foundation that gives you a natural glow.',
    inStock: true,
    stock: 40,
  },
  {
    id: 4,
    name: 'Matte Lipstick',
    price: 18,
    category: 'Lips',
    image: '/images/products/matte-lipstick.jpg',
    discount: 25,
    description: 'Long-lasting matte lipstick in various shades.',
    inStock: true,
    stock: 60,
  },
];

// Helper functions
export const getProductById = (id) => {
  if (!id) return null;
  const productId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(productId)) return null;
  return products.find(product => product.id === productId) || null;
};

export const getProductsByCategory = (category) => {
  if (!category || typeof category !== 'string') return products;
  const normalizedCategory = category.toLowerCase().trim();
  if (!normalizedCategory) return products;
  return products.filter(product => 
    product.category && product.category.toLowerCase() === normalizedCategory
  );
};

export const searchProducts = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') return products;
  const term = searchTerm.toLowerCase().trim();
  if (!term) return products;
  return products.filter(product =>
    (product.name && product.name.toLowerCase().includes(term)) ||
    (product.category && product.category.toLowerCase().includes(term)) ||
    (product.description && product.description.toLowerCase().includes(term))
  );
};
