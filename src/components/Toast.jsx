import React, { useState, useEffect, useCallback } from 'react';
import './Toast.css';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type, duration) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event) => {
      const { message, type = 'info', duration = 3000 } = event.detail;
      addToast(message, type, duration);
    };

    window.addEventListener('toast', handleToast);
    return () => {
      window.removeEventListener('toast', handleToast);
    };
  }, [addToast]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Global toast function for easy access
export const showToast = (message, type = 'info', duration = 3000) => {
  const event = new CustomEvent('toast', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

export default Toast;
