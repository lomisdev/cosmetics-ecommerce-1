const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/orders.json');

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read orders from file
async function readOrders() {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write orders to file
async function writeOrders(orders) {
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2));
}

class Order {
  // Get all orders
  static async findAll() {
    return await readOrders();
  }

  // Find order by ID
  static async findById(id) {
    const orders = await readOrders();
    return orders.find(o => o.id === id) || null;
  }

  // Find orders by user ID
  static async findByUserId(userId) {
    const orders = await readOrders();
    return orders.filter(o => o.userId === userId);
  }

  // Create order
  static async create(orderData) {
    const orders = await readOrders();
    const order = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(order);
    await writeOrders(orders);
    return order;
  }

  // Update order
  static async update(id, updates) {
    const orders = await readOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    orders[index] = { ...orders[index], ...updates };
    await writeOrders(orders);
    return orders[index];
  }

  // Delete order
  static async delete(id) {
    const orders = await readOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    orders.splice(index, 1);
    await writeOrders(orders);
    return true;
  }
}

module.exports = { Order };
