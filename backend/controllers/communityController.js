const CommunityPost = require('../models/CommunityPost');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Helper to get image path from req.file
const getImagePath = (req) => {
  if (req.file) {
    if (isCloudinaryConfigured) {
      return req.file.path;
    } else {
      return `/uploads/${req.file.filename}`;
    }
  }
  return '';
};

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({})
      .populate('author', 'name role')
      .sort({ date: -1, createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single community post
// @route   GET /api/community/:id
// @access  Public
exports.getPostById = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a community post (Admin only)
// @route   POST /api/community
// @access  Private/Admin
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, type, date } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    const image = getImagePath(req) || req.body.image || '';

    const post = await CommunityPost.create({
      title,
      content,
      type: type || 'update',
      date: date || Date.now(),
      author: req.user._id,
      image
    });

    const populatedPost = await post.populate('author', 'name role');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a community post (Admin only)
// @route   PUT /api/community/:id
// @access  Private/Admin
exports.updatePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { title, content, type, date } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.type = type || post.type;
    post.date = date || post.date;

    const newImage = getImagePath(req);
    if (newImage) {
      post.image = newImage;
    } else if (req.body.image !== undefined) {
      post.image = req.body.image;
    }

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate('author', 'name role');

    res.json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a community post (Admin only)
// @route   DELETE /api/community/:id
// @access  Private/Admin
exports.deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};
