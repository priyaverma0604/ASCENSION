const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
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
    required: [true, 'Please add review text']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  designation: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
