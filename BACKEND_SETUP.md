# Backend Setup Guide

## Quick Start

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create product (Admin, requires auth)
- `PUT /api/products/:id` - Update product (Admin, requires auth)
- `DELETE /api/products/:id` - Delete product (Admin, requires auth)

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add item to cart (requires auth)
  ```json
  {
    "productId": "1",
    "quantity": 2
  }
  ```
- `PUT /api/cart/update/:itemId` - Update cart item (requires auth)
- `DELETE /api/cart/remove/:itemId` - Remove item from cart (requires auth)
- `DELETE /api/cart/clear` - Clear cart (requires auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)

## Frontend Integration

The frontend is already configured to use the backend API. Update the API URL in `src/constants/config.js` if needed:

```javascript
API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
```

## Data Storage

Currently uses JSON files for data storage:
- `backend/data/products.json` - Product data
- `backend/data/users.json` - User data
- `backend/data/carts.json` - Cart data
- `backend/data/orders.json` - Order data

These files are created automatically on first run.

## Adding Product Images

1. Place product images in `public/images/products/` directory
2. Name them according to the product (e.g., `rose-lip-balm.jpg`)
3. Update product data to reference the image path

## Production Deployment

For production:
1. Change `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Consider migrating to a database (MongoDB, PostgreSQL)
4. Set up proper file storage (AWS S3, Cloudinary)
5. Add rate limiting and security headers
