const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a workshop title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a workshop description']
  },
  date: {
    type: Date,
    required: [true, 'Please specify the workshop date']
  },
  time: {
    type: String,
    required: [true, 'Please specify the workshop time (e.g., 4:00 PM - 6:00 PM)']
  },
  pricing: {
    type: Number,
    required: [true, 'Please specify pricing in INR'],
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify maximum capacity']
  },
  zoomLink: {
    type: String,
    default: ''
  },
  whatsappGroupLink: {
    type: String,
    default: ''
  },
  introVideoUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  registeredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'free'],
        default: 'pending'
      },
      paymentId: { type: String },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Workshop', workshopSchema);
