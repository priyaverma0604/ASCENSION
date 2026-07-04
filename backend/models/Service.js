const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  benefits: [
    {
      type: String
    }
  ],
  duration: {
    type: Number,
    required: [true, 'Please specify duration in minutes'],
    default: 60
  },
  pricing: {
    type: Number,
    required: [true, 'Please specify pricing in INR']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
