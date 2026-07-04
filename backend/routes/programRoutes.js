const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  createEnrollmentOrder,
  verifyEnrollmentPayment
} = require('../controllers/programController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getPrograms)
  .post(protect, admin, upload.array('images', 5), createProgram);

router.route('/:id')
  .get(getProgramById)
  .put(protect, admin, upload.array('images', 5), updatedProgram => updateProgram(updatedProgram, ...arguments)) // Wait, standard syntax:
  .put(protect, admin, upload.array('images', 5), updateProgram)
  .delete(protect, admin, deleteProgram);

router.post('/:id/enroll-order', protect, createEnrollmentOrder);
router.post('/:id/enroll-verify', protect, verifyEnrollmentPayment);

module.exports = router;
