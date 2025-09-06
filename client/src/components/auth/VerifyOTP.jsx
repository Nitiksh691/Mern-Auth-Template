// components/auth/VerifyOTP.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const { verifyOTP, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from previous page state
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    const result = await verifyOTP(email, parseInt(otp));
    
    if (result.success) {
      // Navigate to reset password with email in state
      navigate('/reset-password', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
          <p className="text-gray-600 mt-2">
            Enter the 6-digit OTP sent to your email address
          </p>
          {email && (
            <p className="text-sm text-gray-500 mt-1">
              Sent to: {email}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              required
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <button 
            className="text-sm text-blue-600 hover:text-blue-700"
            onClick={() => navigate('/forgot-password')}
          >
            Didn't receive OTP? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
