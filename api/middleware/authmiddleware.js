// middleware/authmiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  let token;

  // Debug: Log all cookies
  console.log('🍪 All cookies:', req.cookies);
  console.log('🔍 Looking for token...');

  // Check cookies first (your app uses cookies)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('✅ Token found in cookies');
  } 
  // Fallback: Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token found in Authorization header');
  }

  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    console.log('🔐 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('✅ User authenticated:', user.email);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;
