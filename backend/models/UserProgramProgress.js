const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  photo: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const userProgramProgressSchema = new mongoose.Schema({
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
  currentDay: {
    type: Number,
    default: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  submissions: [submissionSchema]
}, {
  timestamps: true
});

// Ensure a user has only one progress tracker per program
userProgramProgressSchema.index({ user: 1, program: 1 }, { unique: true });

module.exports = mongoose.model('UserProgramProgress', userProgramProgressSchema);
