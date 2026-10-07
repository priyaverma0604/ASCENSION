const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserStats,
  updateUserRole,
  deleteUser
} = require('../controllers/userAdminController');
const { protect, admin } = require('../middleware/auth');

// All user management routes require Admin privileges
router.use(protect);
router.use(admin);

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
