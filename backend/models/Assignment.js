const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  dayNumber: {
    type: Number,
    required: [true, 'Please add a day number']
  },
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add assignment content']
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Please specify estimated duration']
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Compound unique index so a program cannot have duplicate assignments for the same day
assignmentSchema.index({ program: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
