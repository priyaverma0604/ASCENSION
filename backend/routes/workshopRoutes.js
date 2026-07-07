const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  registerForWorkshop,
  verifyWorkshopPayment,
  getAllWorkshopRegistrations,
  approveWorkshopRegistration,
  rejectWorkshopRegistration,
  deleteWorkshopRegistration
} = require('../controllers/workshopController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getWorkshops)
  .post(protect, admin, createWorkshop);

router.route('/registrations')
  .get(protect, admin, getAllWorkshopRegistrations);

router.route('/registrations/:id/approve')
  .put(protect, admin, approveWorkshopRegistration);

router.route('/registrations/:id/reject')
  .put(protect, admin, rejectWorkshopRegistration);

router.route('/registrations/:id')
  .delete(protect, admin, deleteWorkshopRegistration);

router.route('/:id')
  .get(getWorkshopById)
  .put(protect, admin, updateWorkshop)
  .delete(protect, admin, deleteWorkshop);

router.post('/:id/register', upload.single('paymentScreenshot'), registerForWorkshop);
router.post('/:id/verify', verifyWorkshopPayment);

module.exports = router;
