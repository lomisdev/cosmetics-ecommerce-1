import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import AppBar from './components/AppBar';
import BottomNavbar from './components/BottomNavbar';
import Toast from './components/Toast';
import PerformanceMonitor from './components/PerformanceMonitor';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import AppRoutes from './AppRoutes';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <SplashScreen />
      <Toast />
      <PerformanceMonitor />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <Router>
                    <div className="App fade-in">
                      <AppBar />
                      <main className="main-content">
                        <AppRoutes />
                      </main>
                      <BottomNavbar />
                    </div>
                  </Router>
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
