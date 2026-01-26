const fs = require('fs').promises;
const path = require('path');
const { Product } = require('./Product');

const DATA_FILE = path.join(__dirname, '../data/carts.json');

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read carts from file
async function readCarts() {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write carts to file
async function writeCarts(carts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(carts, null, 2));
}

class Cart {
  // Find cart by user ID
  static async findByUserId(userId) {
    const carts = await readCarts();
    let cart = carts.find(c => c.userId === userId);
    
    if (!cart) {
      // Create new cart
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      carts.push(cart);
      await writeCarts(carts);
    }

    // Populate product details
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item,
          ...product,
          id: item.id || item.productId,
        };
      })
    );

    return {
      ...cart,
      items: itemsWithProducts,
    };
  }

  // Add item to cart
  static async addItem(userId, productId, quantity = 1) {
    const carts = await readCarts();
    let cart = carts.find(c => c.userId === userId);

    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      carts.push(cart);
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `${productId}-${Date.now()}`,
        productId,
        quantity,
      });
    }

    cart.updatedAt = new Date().toISOString();
    await writeCarts(carts);
    return await this.findByUserId(userId);
  }

  // Update cart item
  static async updateItem(userId, itemId, quantity) {
    const carts = await readCarts();
    const cart = carts.find(c => c.userId === userId);
    
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    await writeCarts(carts);
    return await this.findByUserId(userId);
  }

  // Remove item from cart
  static async removeItem(userId, itemId) {
    const carts = await readCarts();
    const cart = carts.find(c => c.userId === userId);
    
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date().toISOString();
    await writeCarts(carts);
    return await this.findByUserId(userId);
  }

  // Clear cart
  static async clear(userId) {
    const carts = await readCarts();
    const cart = carts.find(c => c.userId === userId);
    
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date().toISOString();
      await writeCarts(carts);
    }
  }
}

module.exports = { Cart };
