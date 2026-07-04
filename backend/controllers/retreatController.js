const Retreat = require('../models/Retreat');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
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

// @desc    Get all retreats
// @route   GET /api/retreats
// @access  Public
exports.getRetreats = async (req, res, next) => {
  try {
    const retreats = await Retreat.find({});
    res.json({ success: true, count: retreats.length, data: retreats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single retreat details
// @route   GET /api/retreats/:id
// @access  Public
exports.getRetreatById = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }
    res.json({ success: true, data: retreat });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a retreat (Admin only)
// @route   POST /api/retreats
// @access  Private/Admin
exports.createRetreat = async (req, res, next) => {
  try {
    const { title, description, itinerary, pricing, capacity } = req.body;

    const images = getImagesPaths(req);
    if (images.length === 0 && req.body.images) {
      if (Array.isArray(req.body.images)) {
        images.push(...req.body.images);
      } else {
        images.push(req.body.images);
      }
    }

    // Parse itinerary if sent as string JSON
    let parsedItinerary = [];
    if (itinerary) {
      parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    }

    const retreat = await Retreat.create({
      title,
      description,
      itinerary: parsedItinerary,
      pricing,
      capacity,
      images
    });

    res.status(201).json({ success: true, data: retreat });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a retreat (Admin only)
// @route   PUT /api/retreats/:id
// @access  Private/Admin
exports.updateRetreat = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }

    const { title, description, itinerary, pricing, capacity } = req.body;

    retreat.title = title || retreat.title;
    retreat.description = description || retreat.description;
    retreat.pricing = pricing !== undefined ? pricing : retreat.pricing;
    retreat.capacity = capacity !== undefined ? capacity : retreat.capacity;

    if (itinerary) {
      retreat.itinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    }

    const newImages = getImagesPaths(req);
    if (newImages.length > 0) {
      retreat.images = newImages;
    } else if (req.body.images) {
      retreat.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updatedRetreat = await retreat.save();
    res.json({ success: true, data: updatedRetreat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a retreat (Admin only)
// @route   DELETE /api/retreats/:id
// @access  Private/Admin
exports.deleteRetreat = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }

    await retreat.deleteOne();
    res.json({ success: true, message: 'Retreat removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register interest in a retreat
// @route   POST /api/retreats/:id/interest
// @access  Public
exports.registerRetreatInterest = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }

    const { name, email, phone, message, userId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and phone' });
    }

    // Add to interested list
    retreat.interestedUsers.push({
      user: userId || null,
      name,
      email,
      phone,
      message,
      bookedStatus: 'inquiry'
    });

    await retreat.save();
    res.status(201).json({ success: true, message: 'Your interest has been logged successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate retreat booking payment
// @route   POST /api/retreats/:id/book
// @access  Private
exports.bookRetreat = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }

    const amount = retreat.pricing;

    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;

    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `receipt_retreat_${retreat._id.toString().substring(0, 10)}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponseId = order.id;
    } else {
      console.log(`Razorpay simulated order created for Retreat: ${retreat.title}, Amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponseId,
        amount: amount * 100, // paise
        currency: 'INR',
        retreatId: retreat._id,
        user: {
          name: req.user.name,
          email: req.user.email,
          phone: req.body.phone || ''
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and confirm booking
// @route   POST /api/retreats/:id/verify
// @access  Private
exports.verifyRetreatBooking = async (req, res, next) => {
  try {
    const retreat = await Retreat.findById(req.params.id);
    if (!retreat) {
      return res.status(404).json({ success: false, message: 'Retreat not found' });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, phone, message } = req.body;

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment details' });
      }

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
      console.log('Retreat payment signature verified (Simulation Mode)');
    }

    // Add to interested/booking list as "booked"
    const payId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(6).toString('hex')}`;
    
    // Check if they are already in the list, if so promote them to booked
    const existingIndex = retreat.interestedUsers.findIndex(
      u => u.email.toLowerCase() === req.user.email.toLowerCase()
    );

    if (existingIndex > -1) {
      retreat.interestedUsers[existingIndex].bookedStatus = 'booked';
    } else {
      retreat.interestedUsers.push({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: phone || '',
        message: message || 'Direct booking through payments',
        bookedStatus: 'booked'
      });
    }

    await retreat.save();

    res.json({
      success: true,
      message: 'Successfully booked and reserved slot for the retreat!',
      data: retreat
    });
  } catch (error) {
    next(error);
  }
};
