const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5,
    default: 5
  },
  reviewText: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  videoType: {
    type: String,
    enum: ['instagram', 'youtube', 'vimeo', 'custom', ''],
    default: ''
  },
  isVideo: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  designation: {
    type: String,
    default: ''
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  },
  programTitle: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
