export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return only essential user data
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      userName: req.user.userName,
      email: req.user.email,
      isOTPVerified: req.user.isOTPVerified || false
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
