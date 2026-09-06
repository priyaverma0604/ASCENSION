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
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ 
      email: { $regex: new RegExp('^' + cleanEmail + '$', 'i') } 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email address' });
    }

    // Generate 6-digit recovery verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Persist code on user document with 15 minutes expiry
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Also backup in global memory
    global.resetCodes = global.resetCodes || {};
    global.resetCodes[cleanEmail] = {
      code: resetCode,
      expires: Date.now() + 15 * 60 * 1000
    };

    // Send Email via Resend / SMTP / Simulator
    const message = `You requested a password reset code for your Ascension account.\n\nYour 6-digit verification code is: ${resetCode}\n\nThis code will expire in 15 minutes. If you did not request this reset, please ignore this email.`;
    
    await sendEmail({
      to: user.email,
      subject: 'Ascension Password Reset Verification Code',
      text: message,
      html: `
        <div style="font-family: 'Georgia', serif, Arial; max-width: 520px; margin: auto; padding: 28px; border: 1px solid #e0d8c3; border-radius: 16px; background-color: #FFFDF7; color: #2C2C2C;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4a5d4e; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Ascension Meditations</h2>
            <p style="color: #8C827A; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Password Reset Request</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6;">Hello <strong>${user.name || 'Friend'}</strong>,</p>
          <p style="font-size: 13px; line-height: 1.6; color: #555;">We received a request to reset the password for your Ascension account. Please use the 6-digit verification code below:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a; background: #EFEBE0; padding: 14px 28px; border-radius: 12px; border: 1px dashed #C9BFAC; font-family: monospace;">${resetCode}</span>
          </div>
          <p style="font-size: 12px; line-height: 1.5; color: #777;">This code is valid for <strong>15 minutes</strong>. If you did not request this, you can safely disregard this email.</p>
          <hr style="border: none; border-top: 1px solid #EAE3D2; margin: 24px 0 16px;" />
          <p style="font-size: 11px; text-align: center; color: #9E948A; margin: 0;">With Love & Light,<br /><strong>Ascension by Sonali Bhasin Kumar</strong></p>
        </div>
      `
    });

    res.json({ 
      success: true, 
      message: 'A 6-digit verification code has been sent to your email address.',
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
      return res.status(400).json({ success: false, message: 'Please provide email, 6-digit verification code, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const user = await User.findOne({ 
      email: { $regex: new RegExp('^' + cleanEmail + '$', 'i') } 
    }).select('+password +resetPasswordCode +resetPasswordExpire');

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address' });
    }

    const isDbCodeValid = user.resetPasswordCode && user.resetPasswordCode === cleanCode && user.resetPasswordExpire && new Date(user.resetPasswordExpire) > new Date();
    const isGlobalCodeValid = global.resetCodes && global.resetCodes[cleanEmail] && global.resetCodes[cleanEmail].code === cleanCode && global.resetCodes[cleanEmail].expires > Date.now();

    if (!isDbCodeValid && !isGlobalCodeValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code. Please request a new code.' });
    }

    // Set and encrypt new password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Clean up memory
    if (global.resetCodes && global.resetCodes[cleanEmail]) {
      delete global.resetCodes[cleanEmail];
    }

    res.json({ success: true, message: 'Password has been successfully reset! You can now log in with your new password.' });
  } catch (error) {
    next(error);
  }
};
