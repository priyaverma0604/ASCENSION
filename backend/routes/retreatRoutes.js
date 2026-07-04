const express = require('express');
const router = express.Router();
const {
  getRetreats,
  getRetreatById,
  createRetreat,
  updateRetreat,
  deleteRetreat,
  registerRetreatInterest,
  bookRetreat,
  verifyRetreatBooking
} = require('../controllers/retreatController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getRetreats)
  .post(protect, admin, upload.array('images', 5), createRetreat);

router.route('/:id')
  .get(getRetreatById)
  .put(protect, admin, upload.array('images', 5), updateRetreat)
  .delete(protect, admin, deleteRetreat);

router.post('/:id/interest', registerRetreatInterest);
router.post('/:id/book', protect, bookRetreat);
router.post('/:id/verify', protect, verifyRetreatBooking);

module.exports = router;
