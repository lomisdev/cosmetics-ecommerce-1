const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/products.json');

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create with default data
    const defaultProducts = [
      {
        id: '1',
        name: 'Rose Lip Balm',
        price: 15,
        category: 'Lips',
        image: '/uploads/products/rose-lip-balm.jpg',
        discount: 20,
        description: 'Moisturizing lip balm with rose extract for soft, hydrated lips.',
        inStock: true,
        stock: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Hydrating Serum',
        price: 25,
        category: 'Skincare',
        image: '/uploads/products/hydrating-serum.jpg',
        discount: 35,
        description: 'Deep hydrating serum for glowing, radiant skin.',
        inStock: true,
        stock: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Glow Foundation',
        price: 30,
        category: 'Makeup',
        image: '/uploads/products/glow-foundation.jpg',
        discount: 40,
        description: 'Lightweight foundation that gives you a natural glow.',
        inStock: true,
        stock: 40,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Matte Lipstick',
        price: 18,
        category: 'Lips',
        image: '/uploads/products/matte-lipstick.jpg',
        discount: 25,
        description: 'Long-lasting matte lipstick in various shades.',
        inStock: true,
        stock: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultProducts, null, 2));
  }
}

// Read products from file
async function readProducts() {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write products to file
async function writeProducts(products) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
}

class Product {
  // Get all products
  static async findAll() {
    return await readProducts();
  }

  // Find product by ID
  static async findById(id) {
    const products = await readProducts();
    return products.find(p => p.id === id) || null;
  }

  // Find products by category
  static async findByCategory(category) {
    const products = await readProducts();
    return products.filter(p => 
      p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search products
  static async search(term) {
    const products = await readProducts();
    const searchTerm = term.toLowerCase();
    return products.filter(p =>
      (p.name && p.name.toLowerCase().includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(searchTerm)) ||
      (p.description && p.description.toLowerCase().includes(searchTerm))
    );
  }

  // Create product
  static async create(productData) {
    const products = await readProducts();
    products.push(productData);
    await writeProducts(products);
    return productData;
  }

  // Update product
  static async update(id, updates) {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates };
    await writeProducts(products);
    return products[index];
  }

  // Delete product
  static async delete(id) {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    await writeProducts(products);
    return true;
  }
}

module.exports = { Product };
