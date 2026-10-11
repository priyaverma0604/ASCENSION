const Testimonial = require('../models/Testimonial');
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

// @desc    Get all testimonials (Public / Admin)
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate('user', 'name email avatar')
      .populate('program', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a testimonial (Public or user logged-in)
// @route   POST /api/testimonials
// @access  Public / Authenticated
exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, rating, reviewText, isFeatured, email, designation, program, programTitle } = req.body;

    const userName = name || req.user?.name;
    const userEmail = email || req.user?.email || '';

    if (!userName || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide name and review text' });
    }

    const image = getImagePath(req) || req.body.image || (req.user?.avatar || '');

    const testimonial = await Testimonial.create({
      user: req.user?._id || null,
      name: userName,
      email: userEmail,
      rating: rating ? Number(rating) : 5,
      reviewText: reviewText.trim(),
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : true,
      designation: designation || (programTitle ? `Participant: ${programTitle}` : 'Blessed Seeker'),
      program: program || null,
      programTitle: programTitle || '',
      image
    });

    res.status(201).json({ success: true, message: 'Thank you for your blessed review!', data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a testimonial (Admin only)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const { name, rating, reviewText, isFeatured } = req.body;

    testimonial.name = name || testimonial.name;
    testimonial.rating = rating !== undefined ? rating : testimonial.rating;
    testimonial.reviewText = reviewText || testimonial.reviewText;
    
    if (isFeatured !== undefined) {
      testimonial.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    const newImage = getImagePath(req);
    if (newImage) {
      testimonial.image = newImage;
    } else if (req.body.image !== undefined) {
      testimonial.image = req.body.image;
    }

    const updatedTestimonial = await testimonial.save();
    res.json({ success: true, data: updatedTestimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a testimonial (Admin only)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
