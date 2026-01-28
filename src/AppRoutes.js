import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import FAQ from './pages/FAQ';
import ShippingReturns from './pages/ShippingReturns';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import Register from './pages/Register';
import AccountAuth from './components/AccountAuth';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/shipping-returns" element={<ShippingReturns />} />
      <Route path="/search" element={<Search />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<AccountAuth />} />
      <Route path="/login" element={<AccountAuth />} />
    </Routes>
  );
};

export default AppRoutes;
