// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../service/api';
import useToastStore from './toastStore';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),
      clearUser: () => set({ user: null, error: null }),

      // Signup
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', userData);
          set({ 
            user: response.data.user, 
            isLoading: false,
            error: null 
          });
          
          // Show success toast
          useToastStore.getState().success(
            `Welcome ${response.data.user.name}! Your account has been created successfully.`,
            'Account Created'
          );
          
          return { success: true, user: response.data.user };
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Signup failed';
          set({ error: errorMsg, isLoading: false });
          
          // Show error toast
          useToastStore.getState().error(errorMsg, 'Signup Failed');
          
          return { success: false, error: errorMsg };
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const userData = response.data.user;
          
          set({ 
            user: userData, 
            isLoading: false,
            error: null 
          });
          
          // Show success toast
          useToastStore.getState().success(
            `Welcome back, ${userData.name}!`,
            'Login Successful'
          );
          
          return { success: true, user: userData };
        } catch (error) {
          console.error('Login error:', error);
          const errorMsg = error.response?.data?.error || 'Login failed';
          set({ 
            error: errorMsg, 
            isLoading: false,
            user: null 
          });
          
          // Show error toast
          useToastStore.getState().error(errorMsg, 'Login Failed');
          
          return { success: false, error: errorMsg };
        }
      },

      // Logout
      // store/authStore.js - Update logout function
logout: async () => {
  set({ isLoading: true });
  try {
    await api.get('/auth/logout');
    
    // Show success toast
    useToastStore.getState().success(
      'You have been logged out successfully',
      'Logged Out'
    );
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails on server, clear local state
  } finally {
    // Always clear local state after logout
    set({ 
      user: null, 
      error: null, 
      isLoading: false 
    });
    
    // Don't try to get current user after logout
    // The app will handle redirects based on user state
  }
},


      // Get current user
// store/authStore.js - Update getCurrentUser
getCurrentUser: async () => {
  try {
    const response = await api.get('/user/me');
    set({ 
      user: response.data, 
      isLoading: false 
    });
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Get current user error:', error.response?.status);
    
    // Don't show toast for 401 errors (normal when not logged in)
    if (error.response?.status === 401) {
      set({ user: null, isLoading: false });
      return { success: false, error: 'Not authenticated' };
    }
    
    set({ 
      user: null, 
      isLoading: false 
    });
    return { success: false };
  }
},


      // Send OTP
      sendOTP: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/sendotp', { email });
          set({ isLoading: false });
          
          // Show success toast
          useToastStore.getState().success(
            'OTP has been sent to your email address',
            'OTP Sent'
          );
          
          return { success: true };
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to send OTP';
          set({ error: errorMsg, isLoading: false });
          
          // Show error toast
          useToastStore.getState().error(errorMsg, 'Failed to Send OTP');
          
          return { success: false, error: errorMsg };
        }
      },

      // Verify OTP - FIXED NAME
      verifyOTP: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/verifyotp', { email, otp });
          set({ isLoading: false });
          
          // Show success toast
          useToastStore.getState().success(
            'OTP verified successfully. You can now reset your password.',
            'OTP Verified'
          );
          
          return { success: true };
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Invalid OTP';
          set({ error: errorMsg, isLoading: false });
          
          // Show error toast
          useToastStore.getState().error(errorMsg, 'OTP Verification Failed');
          
          return { success: false, error: errorMsg };
        }
      },

      // Reset Password
      resetPassword: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/resetpassword', { email, password });
          set({ isLoading: false });
          
          // Show success toast
          useToastStore.getState().success(
            'Your password has been reset successfully. Please login with your new password.',
            'Password Reset Successful'
          );
          
          return { success: true };
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Password reset failed';
          set({ error: errorMsg, isLoading: false });
          
          // Show error toast
          useToastStore.getState().error(errorMsg, 'Password Reset Failed');
          
          return { success: false, error: errorMsg };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
