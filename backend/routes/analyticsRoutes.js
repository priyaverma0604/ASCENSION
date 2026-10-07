const express = require('express');
const router = express.Router();
const {
  trackVisit,
  getAnalyticsSummary,
  getRecentVisits,
  clearAnalytics
} = require('../controllers/analyticsController');
const { protect, optionalProtect, admin } = require('../middleware/auth');

// Public tracking endpoint (optionalProtect to capture req.user if logged in)
router.post('/track', optionalProtect, trackVisit);

// Protected admin analytics endpoints
router.get('/summary', protect, admin, getAnalyticsSummary);
router.get('/recent', protect, admin, getRecentVisits);
router.delete('/clear', protect, admin, clearAnalytics);

module.exports = router;
