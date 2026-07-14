const Program = require('../models/Program');
const User = require('../models/User');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const crypto = require('crypto');

// Helper to get image paths from req.files
const getImagesPaths = (req) => {
  if (req.files && req.files.length > 0) {
    return req.files.map(file => {
      if (isCloudinaryConfigured) {
        return file.path;
      } else {
        return `/uploads/${file.filename}`;
      }
    });
  }
  return [];
};

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({}).populate('enrolledUsers', 'name email');
    res.json({ success: true, count: programs.length, data: programs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id).populate('enrolledUsers', 'name email');
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
exports.createProgram = async (req, res, next) => {
  try {
    const { title, description, duration, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink } = req.body;

    const finalSellingPrice = sellingPrice !== undefined ? Number(sellingPrice) : (pricing !== undefined ? Number(pricing) : 0);
    const finalOriginalPrice = originalPrice !== undefined ? Number(originalPrice) : finalSellingPrice;

    const images = getImagesPaths(req);
    if (images.length === 0 && req.body.images) {
      // If links were sent directly
      if (Array.isArray(req.body.images)) {
        images.push(...req.body.images);
      } else {
        images.push(req.body.images);
      }
    }

    const program = await Program.create({
      title,
      description,
      duration,
      pricing: finalSellingPrice,
      originalPrice: finalOriginalPrice,
      sellingPrice: finalSellingPrice,
      zoomLink: zoomLink || '',
      enrollmentCapacity,
      images,
      youtubeUrl
    });

    res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { title, description, duration, pricing, enrollmentCapacity, youtubeUrl, originalPrice, sellingPrice, zoomLink } = req.body;

    program.title = title || program.title;
    program.description = description || program.description;
    program.duration = duration || program.duration;
    
    if (sellingPrice !== undefined) {
      program.sellingPrice = Number(sellingPrice);
      program.pricing = Number(sellingPrice);
    } else if (pricing !== undefined) {
      program.pricing = Number(pricing);
      program.sellingPrice = Number(pricing);
    }
    
    if (originalPrice !== undefined) {
      program.originalPrice = Number(originalPrice);
    }

    if (zoomLink !== undefined) {
      program.zoomLink = zoomLink;
    }
    
    program.enrollmentCapacity = enrollmentCapacity !== undefined ? enrollmentCapacity : program.enrollmentCapacity;
    if (youtubeUrl !== undefined) {
      program.youtubeUrl = youtubeUrl;
    }

    const newImages = getImagesPaths(req);
    if (newImages.length > 0) {
      program.images = newImages;
    } else if (req.body.images) {
      program.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updatedProgram = await program.save();
    res.json({ success: true, data: updatedProgram });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    await program.deleteOne();
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create program enrollment Razorpay order
// @route   POST /api/programs/:id/enroll-order
// @access  Private
exports.createEnrollmentOrder = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if user is already enrolled
    if (program.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this program' });
    }

    // Check capacity
    if (program.enrolledUsers.length >= program.enrollmentCapacity) {
      return res.status(400).json({ success: false, message: 'Program capacity has been reached' });
    }

    const amount = program.pricing; // In INR

    // If pricing is 0, we can enroll directly
    if (amount === 0) {
      program.enrolledUsers.push(req.user._id);
      await program.save();
      return res.json({ success: true, free: true, message: 'Successfully enrolled in free program' });
    }

    let orderResponse = {
      orderId: `mock_order_${crypto.randomBytes(6).toString('hex')}`,
      amount: amount * 100, // in paise
      currency: 'INR'
    };

    if (isRazorpayConfigured) {
      const options = {
        amount: amount * 100, // paise
        currency: 'INR',
        receipt: `receipt_program_${program._id.toString().substring(0, 10)}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponse.orderId = order.id;
    } else {
      console.log(`Razorpay simulated order created for Program: ${program.title}, amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponse.orderId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        programId: program._id,
        user: {
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify program enrollment payment & enroll
// @route   POST /api/programs/:id/enroll-verify
// @access  Private
exports.verifyEnrollmentPayment = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Please provide all payment verification fields' });
      }

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
      }
    } else {
      console.log('Razorpay payment signature verified (Simulation Mode).');
    }

    // Enroll user if not already enrolled
    if (!program.enrolledUsers.includes(req.user._id)) {
      program.enrolledUsers.push(req.user._id);
      await program.save();
    }

    res.json({
      success: true,
      message: 'Payment verified and enrolled successfully!',
      program
    });
  } catch (error) {
    next(error);
  }
};
