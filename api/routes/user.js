// routes/user.js
import express from 'express';
import { getCurrentUser } from '../controller/user.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

// Your existing route
router.get('/me', protect, getCurrentUser);

// 👇 ADD THIS NEW TEST ROUTE
router.get('/test-auth', protect, (req, res) => {
  res.json({ 
    message: 'Auth middleware working!', 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      userName: req.user.userName
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
