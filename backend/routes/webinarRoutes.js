const express = require('express');
const router = express.Router();
const {
  getWebinars,
  getWebinarById,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  registerForWebinar,
  getAllRegistrations,
  approveRegistration,
  rejectRegistration,
  deleteRegistration
} = require('../controllers/webinarController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Optional user auth checker on public route so we can expose Zoom link if logged in as Admin
const getOptionalUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        req.user = await User.findById(decoded.id);
      }
      next();
    });
  } else {
    next();
  }
};

router.route('/')
  .get(getOptionalUser, getWebinars)
  .post(
    protect, 
    admin, 
    upload.fields([
      { name: 'coverImage', maxCount: 1 }, 
      { name: 'upiQrCodeImage', maxCount: 1 }
    ]), 
    createWebinar
  );

router.route('/registrations')
  .get(protect, admin, getAllRegistrations);

router.route('/registrations/:id/approve')
  .put(protect, admin, approveRegistration);

router.route('/registrations/:id/reject')
  .put(protect, admin, rejectRegistration);

router.route('/registrations/:id')
  .delete(protect, admin, deleteRegistration);

router.route('/:id')
  .get(getOptionalUser, getWebinarById)
  .put(
    protect, 
    admin, 
    upload.fields([
      { name: 'coverImage', maxCount: 1 }, 
      { name: 'upiQrCodeImage', maxCount: 1 }
    ]), 
    updateWebinar
  )
  .delete(protect, admin, deleteWebinar);

router.route('/:id/register')
  .post(upload.single('paymentScreenshot'), registerForWebinar);

module.exports = router;
