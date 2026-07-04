const express = require('express');
const router = express.Router();
const {
  createDonationOrder,
  verifyDonationPayment,
  logManualUPIDonation,
  getDonations,
  updateDonationStatus
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth');

router.post('/razorpay-order', createDonationOrder);
router.post('/verify', verifyDonationPayment);
router.post('/log-upi', logManualUPIDonation);

router.route('/')
  .get(protect, admin, getDonations);

router.route('/:id/status')
  .put(protect, admin, updateDonationStatus);

module.exports = router;
