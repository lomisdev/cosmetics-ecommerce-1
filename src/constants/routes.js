// Application Routes

export const ROUTES = {

  HOME: '/',

  ABOUT: '/about',

  PRODUCTS: '/products',

  PRODUCT_DETAIL: '/product/:id',

  CART: '/cart',

  CHECKOUT: '/checkout',

  FAQ: '/faq',

  SHIPPING_RETURNS: '/shipping-returns',

  ACCOUNT: '/account',

  ADMIN: '/admin',

  LOGIN: '/login',

};



// Route helpers

export const getProductRoute = (id) => `/product/${id}`;

export const getCategoryRoute = (category) => `/products?cat=${category}`;

