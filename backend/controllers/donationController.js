const Donation = require('../models/Donation');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Initiate donation - create Razorpay order
// @route   POST /api/donations/razorpay-order
// @access  Public
exports.createDonationOrder = async (req, res, next) => {
  try {
    const { amount, name, email, phone, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please specify a valid donation amount' });
    }

    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;

    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `receipt_donation_${crypto.randomBytes(4).toString('hex')}`
      };
      const order = await razorpayInstance.orders.create(options);
      orderResponseId = order.id;
    } else {
      console.log(`Razorpay simulated donation order created, amount: Rs. ${amount}`);
    }

    res.json({
      success: true,
      data: {
        orderId: orderResponseId,
        amount: amount * 100, // paise
        currency: 'INR',
        donor: {
          name: name || 'Anonymous',
          email: email || '',
          phone: phone || '',
          message: message || ''
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify donation payment and record completed donation
// @route   POST /api/donations/verify
// @access  Public
exports.verifyDonationPayment = async (req, res, next) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      donor_details 
    } = req.body;

    if (!donor_details || !donor_details.amount) {
      return res.status(400).json({ success: false, message: 'Please provide donation details' });
    }

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
      console.log('Donation payment signature verified (Simulation Mode)');
    }

    // Save completed donation to DB
    const payId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(6).toString('hex')}`;
    
    const donation = await Donation.create({
      name: donor_details.name || 'Anonymous',
      email: donor_details.email || '',
      phone: donor_details.phone || '',
      amount: donor_details.amount,
      transactionId: payId,
      paymentType: 'Razorpay',
      status: 'completed',
      message: donor_details.message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your generous donation!',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a manual UPI donation (QR Code based submission)
// @route   POST /api/donations/log-upi
// @access  Public
exports.logManualUPIDonation = async (req, res, next) => {
  try {
    const { name, email, phone, amount, transactionId, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid donation amount' });
    }

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Please provide the transaction reference ID' });
    }

    // Check if transaction ID has already been logged
    const existing = await Donation.findOne({ transactionId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This transaction ID has already been submitted' });
    }

    const donation = await Donation.create({
      name: name || 'Anonymous',
      email: email || '',
      phone: phone || '',
      amount,
      transactionId,
      paymentType: 'UPI_QR',
      status: 'pending', // Awaiting Admin verification of funds
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Your donation transaction has been logged! It will show up on our records once verified by our admin. Thank you for your support.',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (Admin only)
// @route   GET /api/donations
// @access  Private/Admin
exports.getDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation status (Admin only)
// @route   PUT /api/donations/:id/status
// @access  Private/Admin
exports.updateDonationStatus = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation log not found' });
    }

    const { status } = req.body;
    if (!status || !['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status: pending, completed, or failed' });
    }

    donation.status = status;
    await donation.save();

    res.json({ success: true, message: `Donation log status updated to ${status}`, data: donation });
  } catch (error) {
    next(error);
  }
};
