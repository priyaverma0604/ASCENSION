const Workshop = require('../models/Workshop');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Public
exports.getWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find({}).sort({ date: 1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workshop details
// @route   GET /api/workshops/:id
// @access  Public
exports.getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }
    res.json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a workshop (Admin only)
// @route   POST /api/workshops
// @access  Private/Admin
exports.createWorkshop = async (req, res, next) => {
  try {
    const { title, description, date, time, pricing, capacity } = req.body;

    const workshop = await Workshop.create({
      title,
      description,
      date,
      time,
      pricing,
      capacity
    });

    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workshop (Admin only)
// @route   PUT /api/workshops/:id
// @access  Private/Admin
exports.updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { title, description, date, time, pricing, capacity } = req.body;

    workshop.title = title || workshop.title;
    workshop.description = description || workshop.description;
    workshop.date = date || workshop.date;
    workshop.time = time || workshop.time;
    workshop.pricing = pricing !== undefined ? pricing : workshop.pricing;
    workshop.capacity = capacity !== undefined ? capacity : workshop.capacity;

    const updatedWorkshop = await workshop.save();
    res.json({ success: true, data: updatedWorkshop });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workshop (Admin only)
// @route   DELETE /api/workshops/:id
// @access  Private/Admin
exports.deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    await workshop.deleteOne();
    res.json({ success: true, message: 'Workshop removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for workshop - create payment order
// @route   POST /api/workshops/:id/register
// @access  Public
exports.registerForWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { name, email, phone, userId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and phone' });
    }

    // Check if capacity is full
    if (workshop.registeredUsers.length >= workshop.capacity) {
      return res.status(400).json({ success: false, message: 'Workshop capacity is full' });
    }

    const amount = workshop.pricing;

    // Free registration
    if (amount === 0) {
      workshop.registeredUsers.push({
        user: userId || null,
        name,
        email,
        phone,
        paymentStatus: 'free',
        paymentId: 'free_registration'
      });
      await workshop.save();
      return res.status(201).json({ success: true, free: true, message: 'Successfully registered for free workshop' });
    }

    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;

    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `receipt_workshop_${workshop._id.toString().substring(0, 10)}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponseId = order.id;
    } else {
      console.log(`Razorpay simulated order created for Workshop: ${workshop.title}, Amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponseId,
        amount: amount * 100, // paise
        currency: 'INR',
        workshopId: workshop._id,
        user: { name, email, phone }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify workshop registration payment
// @route   POST /api/workshops/:id/verify
// @access  Public
exports.verifyWorkshopPayment = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      user_details // containing name, email, phone, userId
    } = req.body;

    if (!user_details || !user_details.name || !user_details.email || !user_details.phone) {
      return res.status(400).json({ success: false, message: 'Please provide user registration details' });
    }

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment signature verification fields' });
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
      console.log('Workshop payment signature verified (Simulation Mode)');
    }

    // Add user to registered list
    const payId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(6).toString('hex')}`;
    
    workshop.registeredUsers.push({
      user: user_details.userId || null,
      name: user_details.name,
      email: user_details.email,
      phone: user_details.phone,
      paymentStatus: 'paid',
      paymentId: payId
    });
    await workshop.save();

    res.json({
      success: true,
      message: 'Successfully registered for the workshop!',
      data: workshop
    });
  } catch (error) {
    next(error);
  }
};
