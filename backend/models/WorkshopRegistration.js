const mongoose = require('mongoose');

const workshopRegistrationSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Please add user name']
  },
  email: {
    type: String,
    required: [true, 'Please add email address']
  },
  phone: {
    type: String,
    required: [true, 'Please add mobile phone number']
  },
  paymentScreenshot: {
    type: String,
    default: ''
  },
  transactionId: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Rejected'],
    default: 'Pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkshopRegistration', workshopRegistrationSchema);
