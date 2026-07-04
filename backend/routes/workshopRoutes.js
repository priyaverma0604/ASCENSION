const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  registerForWorkshop,
  verifyWorkshopPayment
} = require('../controllers/workshopController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getWorkshops)
  .post(protect, admin, createWorkshop);

router.route('/:id')
  .get(getWorkshopById)
  .put(protect, admin, updateWorkshop)
  .delete(protect, admin, deleteWorkshop);

router.post('/:id/register', registerForWorkshop);
router.post('/:id/verify', verifyWorkshopPayment);

module.exports = router;
