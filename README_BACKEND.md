# Backend API Documentation

## Overview

The Glowify backend is a RESTful API built with Express.js that provides endpoints for:
- Product management
- User authentication
- Shopping cart operations
- Order processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Update the environment variables:
   - `PORT`: Server port (default: 3001)
   - `JWT_SECRET`: Secret key for JWT tokens
   - `NODE_ENV`: Environment (development/production)

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Structure

### Base URL
```
http://localhost:3001/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Products

#### Get All Products
```
GET /api/products
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Get Products by Category
```
GET /api/products/category/:category
```

#### Search Products
```
GET /api/products/search?q=query
```

#### Create Product (Admin)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "price": 29.99,
  "category": "Makeup",
  "description": "Product description",
  "image": "/uploads/products/image.jpg",
  "discount": 20,
  "inStock": true,
  "stock": 50
}
```

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Cart

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "1",
  "quantity": 2
}
```

#### Update Cart Item
```
PUT /api/cart/update/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE /api/cart/remove/:itemId
Authorization: Bearer <token>
```

### Orders

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

#### Get User Orders
```
GET /api/orders
Authorization: Bearer <token>
```

## Data Models

### Product
```javascript
{
  id: string,
  name: string,
  price: number,
  category: string,
  image: string,
  discount?: number,
  description: string,
  inStock: boolean,
  stock: number,
  createdAt: string,
  updatedAt: string
}
```

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string (hashed),
  isAdmin: boolean,
  createdAt: string,
  updatedAt: string
}
```

### Cart
```javascript
{
  userId: string,
  items: [
    {
      id: string,
      productId: string,
      quantity: number,
      // Product details populated from Product model
    }
  ],
  updatedAt: string
}
```

### Order
```javascript
{
  id: string,
  userId: string,
  items: Array,
  total: number,
  shippingAddress: Object,
  paymentMethod: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: string,
  updatedAt: string
}
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Frontend Integration

The frontend services in `src/services/` are already configured to work with this backend. They include fallback to local data if the API is unavailable.

To connect the frontend:

1. Start the backend server
2. Update `src/constants/config.js` if needed:
   ```javascript
   API_BASE_URL: 'http://localhost:3001/api'
   ```
3. The frontend will automatically use the API when available

## Next Steps

- Add file upload for product images
- Implement email notifications
- Add payment gateway integration
- Migrate to database (MongoDB/PostgreSQL)
- Add caching layer (Redis)
- Implement rate limiting
