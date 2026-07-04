const Order = require('../models/Order');
const Product = require('../models/Product');
const { razorpayInstance, isRazorpayConfigured } = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Create a new order & initiate Razorpay order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide shipping address' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // Verify products and calculate total cost from database
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` });
      }

      calculatedTotal += product.pricing * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.pricing
      });
    }

    // Initialize Razorpay Order id
    let orderResponseId = `mock_order_${crypto.randomBytes(6).toString('hex')}`;
    
    if (isRazorpayConfigured) {
      const options = {
        amount: Math.round(calculatedTotal * 100), // in paise
        currency: 'INR',
        receipt: `receipt_order_${crypto.randomBytes(4).toString('hex')}`
      };
      
      const razorpayOrder = await razorpayInstance.orders.create(options);
      orderResponseId = razorpayOrder.id;
    } else {
      console.log(`Razorpay simulated order created, total: Rs. ${calculatedTotal}`);
    }

    // Save order in database with pending status
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      orderId: orderResponseId,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.orderId,
        amount: calculatedTotal * 100, // paise
        currency: 'INR',
        dbOrderId: order._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment signature and finalize order
// @route   POST /api/orders/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Find order
    const order = await Order.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found' });
    }

    if (isRazorpayConfigured) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment details' });
      }

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
      }
    } else {
      console.log('Payment verified in simulation mode');
    }

    // Finalize order status & decrement product stocks
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(6).toString('hex')}`;
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment completed and order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please specify status' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    next(error);
  }
};
