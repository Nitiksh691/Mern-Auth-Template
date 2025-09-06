// components/auth/SignupForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signup, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
    if (formData.password.length < 6) return alert('Password must be at least 6 characters long');
    const { confirmPassword, ...submitData } = formData;
    const result = await signup(submitData);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-white mb-2">Create Account</h2>
          <p className="text-zinc-400 text-sm">Sign up to get started</p>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'userName', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-zinc-300 mb-2">
                {field === 'name'
                  ? 'Full Name'
                  : field === 'userName'
                  ? 'Username'
                  : field === 'email'
                  ? 'Email Address'
                  : field === 'password'
                  ? 'Password'
                  : 'Confirm Password'}
              </label>
              <input
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3 px-4 rounded font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-zinc-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signup;
