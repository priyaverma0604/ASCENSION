const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  verifyOrderPaymentUPI
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, admin, getAllOrders)
  .post(protect, upload.single('paymentScreenshot'), createOrder);

router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/verify-upi', protect, admin, verifyOrderPaymentUPI);

module.exports = router;
