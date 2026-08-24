const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Please upload an image of your work']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComment: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexing for performance when listing user submissions and doing lookup on current day progress
assignmentSubmissionSchema.index({ user: 1, program: 1, dayNumber: 1 });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
