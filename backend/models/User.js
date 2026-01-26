const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read users from file
async function readUsers() {
  await initDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write users to file
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

class User {
  // Get all users
  static async findAll() {
    return await readUsers();
  }

  // Find user by ID
  static async findById(id) {
    const users = await readUsers();
    return users.find(u => u.id === id) || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const users = await readUsers();
    return users.find(u => u.email === email) || null;
  }

  // Create user
  static async create(userData) {
    const users = await readUsers();
    const user = {
      id: userData.id || Date.now().toString(),
      ...userData,
      isAdmin: userData.isAdmin || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    await writeUsers(users);
    return user;
  }

  // Update user
  static async update(id, updates) {
    const users = await readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    await writeUsers(users);
    return users[index];
  }

  // Delete user
  static async delete(id) {
    const users = await readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    await writeUsers(users);
    return true;
  }
}

module.exports = { User };
