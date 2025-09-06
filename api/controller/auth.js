import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/mail.js';

// In your auth controller (signup route)
export const signup = async (req, res) => {
  const { name, email, password, userName } = req.body;
  console.log('📥 Signup request body:', req.body); // Debug log
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) return res.status(400).json({ error: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, userName });

    const token = generateToken(user._id);
    console.log('✅ User created successfully:', user.email); // Success log

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, userName: user.userName } });
   
  } catch (err) {
    console.error('❌ Signup error details:', err); // Detailed error log
    res.status(500).json({ error: 'Signup failed' });
  }
};

// In your auth controller - login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('📥 Login attempt for:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user._id);
    console.log('✅ Generated token for user:', email);

    // Set cookie with proper options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false in development
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/' // Important: make cookie available for all routes
    });

    console.log('🍪 Cookie set successfully');

    res.status(200).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        userName: user.userName 
      } 
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};


export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.json({ message: 'Logged out successfully' });
};


export const sendOTP = async (req,res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:"User not found"});
    const otp = Math.floor(100000 + Math.random() * 900000);

    
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5*60*1000;
    user.isOTPVerified=false;

    await user.save();
    sendEmail(email,otp);
    res.status(200).json({message:"OTP sent successfully"});
  } catch (error) {
    res.status(500).json({error:"Failed to send OTP"});
  }
}

export const verifyOTP = async (req,res) => {
  const {email,otp}= req.body;
  const user = await User.findOne({email})
  try{
    if(!user || user.resetOTPExpire<Date.now() || user.resetOTP!==otp){
      return res.status(400).json({error:"Invalid OTP"});
    }
    user.isOTPVerified=true;
    user.resetOTP=undefined;
    user.resetOTPExpire=undefined;
    await user.save();
    res.status(200).json({message:"OTP verified successfully"});
  }
  catch(err){
    res.status(500).json({error:"Failed to verify OTP"});
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isOTPVerified) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOTPVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "Server error during password reset" });
  }
};
