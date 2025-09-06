// utils/generateToken.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId) => {
  // Add validation to catch the error early
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set! Check your .env file.');
  }
  
  console.log('🔑 Generating token for user:', userId); // Debug log
  
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
