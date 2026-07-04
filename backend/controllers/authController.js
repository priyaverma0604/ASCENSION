const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // First user is automatically set as Admin for initial setup convenience
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    // Check for user (and select password field since it is hidden by default)
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.cart) {
        user.cart = req.body.cart;
      }

      if (req.body.wishlist) {
        user.wishlist = req.body.wishlist;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email' });
    }

    // Generate simulated recovery token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // For local testing convenience, we will write it to global memory
    // In a fully stateless server we'd save to DB, but a simulated session/console output is perfect
    global.resetCodes = global.resetCodes || {};
    global.resetCodes[email] = {
      code: resetCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 mins
    };

    // Send Email
    const message = `You requested a password reset code. Your 6-digit verification code is:\n\n${resetCode}\n\nThis code expires in 10 minutes.`;
    
    await sendEmail({
      to: user.email,
      subject: 'Ascension Password Reset Verification',
      text: message
    });

    res.json({ 
      success: true, 
      message: 'Password reset code sent successfully',
      // We expose it here ONLY in non-production for frictionless local debugging
      code: process.env.NODE_ENV !== 'production' ? resetCode : undefined 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using code
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, verification code, and new password' });
    }

    const savedRecord = global.resetCodes ? global.resetCodes[email] : null;

    if (!savedRecord || savedRecord.code !== code || savedRecord.expires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Clean up reset code
    delete global.resetCodes[email];

    res.json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (error) {
    next(error);
  }
};
