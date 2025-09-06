import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ToastContainer from './components/ui/ToastContainer';

import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/auth/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyOTP from './components/auth/VerifyOTP';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  return !user ? children : <Navigate to="/dashboard" replace />;
};


function App() {
  const { getCurrentUser, user } = useAuthStore();

 useEffect(() => {
    // Only check authentication on initial app load
    // Don't check after logout or if user is already set
    const checkInitialAuth = async () => {
      if (user) {
        // User already authenticated, no need to check
        return;
      }

      try {
        // Check if we have stored auth data (from Zustand persist)
        const authStorage = localStorage.getItem('auth-storage');
        const parsedAuth = authStorage ? JSON.parse(authStorage) : null;
        
        if (parsedAuth?.state?.user) {
          // We have a stored user, verify they're still valid
          console.log('🔍 Verifying stored user session...');
          await getCurrentUser();
        }
      } catch (error) {
        // Silently handle auth errors - normal when not logged in or token expired
        console.log('📝 Auth verification completed (user not authenticated)');
      }
    };

    // Only run on initial mount, not on every render
    checkInitialAuth();
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-otp" 
            element={
              <PublicRoute>
                <VerifyOTP />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </Router>
  );
}


export default App
