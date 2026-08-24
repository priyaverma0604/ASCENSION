const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  createEnrollmentOrder,
  verifyEnrollmentPayment,
  enrollProgramQR,
  getProgramRegistrations,
  verifyProgramRegistration,
  getProgramProgress,
  submitProgramProgressDay,
  getAllProgramProgress
} = require('../controllers/programController');

const {
  createAssignment,
  getAssignmentsAdmin,
  getAssignmentById,
  updateAssignment,
  toggleAssignmentStatus,
  getSubmissionsAdmin,
  reviewSubmission,
  getAssignmentsUser,
  getCurrentAssignment,
  submitAssignment,
  deleteAssignment,
  getAssignmentByDayNum
} = require('../controllers/assignmentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin Registrations management (Must be defined before /:id routes)
router.get('/registrations', protect, admin, getProgramRegistrations);
router.post('/registrations/:regId/verify', protect, admin, verifyProgramRegistration);

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
router.post('/:id/enroll-qr', protect, upload.single('paymentScreenshot'), enrollProgramQR);

// Program daily progress tracking routes
router.get('/:id/progress', protect, getProgramProgress);
router.post('/:id/progress/submit', protect, upload.single('photo'), submitProgramProgressDay);
router.get('/:id/progress/all', protect, admin, getAllProgramProgress);

// Admin assignment management routes
router.post('/:id/assignments', protect, admin, upload.single('image'), createAssignment);
router.get('/:id/assignments/admin', protect, admin, getAssignmentsAdmin);
router.route('/assignments/:assignmentId')
  .get(protect, admin, getAssignmentById)
  .put(protect, admin, upload.single('image'), updateAssignment)
  .delete(protect, admin, deleteAssignment);
router.patch('/assignments/:assignmentId/status', protect, admin, toggleAssignmentStatus);

// Admin submission review routes
router.get('/:id/submissions/admin', protect, admin, getSubmissionsAdmin);
router.patch('/submissions/:submissionId/review', protect, admin, reviewSubmission);

// User assignment routes
router.get('/:id/assignments', protect, getAssignmentsUser);
router.get('/:id/assignments/current', protect, getCurrentAssignment);
router.get('/:id/assignments/day/:dayNumber', protect, getAssignmentByDayNum);
router.post('/assignments/:assignmentId/submit', protect, upload.single('photo'), submitAssignment);

module.exports = router;
