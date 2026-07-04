const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllOrders)
  .post(protect, createOrder);

router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
