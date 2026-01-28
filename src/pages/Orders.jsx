import React from 'react';
import './Orders.css';

const Orders = () => {
  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        <div className="empty-orders">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 2l6 6-6 6" />
            <path d="M21 12H9" />
          </svg>
          <h2>No orders yet</h2>
          <p>When you place your first order, it will appear here!</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
