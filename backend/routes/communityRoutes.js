const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/communityController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getPosts)
  .post(protect, admin, upload.single('image'), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, admin, upload.single('image'), updatePost)
  .delete(protect, admin, deletePost);

module.exports = router;
