const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a program title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a program description']
  },
  duration: {
    type: String,
    required: [true, 'Please specify program duration (e.g., 4 weeks or 3 sessions)']
  },
  pricing: {
    type: Number,
    required: [true, 'Please specify pricing in INR']
  },
  images: [
    {
      type: String
    }
  ],
  youtubeUrl: {
    type: String,
    default: ''
  },
  enrollmentCapacity: {
    type: Number,
    required: [true, 'Please specify maximum capacity']
  },
  enrolledUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
