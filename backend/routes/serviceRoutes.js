const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getServices)
  .post(protect, admin, upload.single('image'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, admin, upload.single('image'), updateService)
  .delete(protect, admin, deleteService);

module.exports = router;
