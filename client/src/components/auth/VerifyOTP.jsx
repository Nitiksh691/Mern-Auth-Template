// components/auth/VerifyOTP.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const { verifyOTP, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) setOtp(value);
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return alert('Enter a valid 6-digit OTP');
    const result = await verifyOTP(email, parseInt(otp));
    if (result.success) navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-white mb-2">Verify OTP</h2>
          <p className="text-zinc-400 text-sm">Enter the 6-digit OTP sent to your email</p>
          {email && <p className="text-xs text-zinc-500 mt-1">Sent to: {email}</p>}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              required
              maxLength="6"
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded text-white text-center text-2xl tracking-widest font-mono placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-white text-black py-3 px-4 rounded font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/forgot-password')} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Didn&apos;t receive OTP? Resend
          </button>
        </div>
      </div>
    </div>
  );
};
export default VerifyOTP;
