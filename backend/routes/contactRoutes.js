const express = require('express');
const router = express.Router();
const {
  submitContact,
  getQueries,
  updateQueryStatus
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getQueries)
  .post(submitContact);

router.route('/:id/status')
  .put(protect, admin, updateQueryStatus);

module.exports = router;
