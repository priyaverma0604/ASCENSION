const express = require('express');
const router = express.Router();
const {
  submitContact,
  getQueries,
  updateQueryStatus,
  getBookedSlots
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, admin, getQueries)
  .post(upload.single('paymentScreenshot'), submitContact);

router.get('/booked-slots', getBookedSlots);

router.route('/:id/status')
  .put(protect, admin, updateQueryStatus);

module.exports = router;
