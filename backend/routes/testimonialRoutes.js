const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getTestimonials)
  .post(upload.single('image'), createTestimonial);

router.route('/:id')
  .put(protect, admin, upload.single('image'), updateTestimonial)
  .delete(protect, admin, deleteTestimonial);

module.exports = router;
