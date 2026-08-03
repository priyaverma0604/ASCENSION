const mongoose = require('mongoose');

const webinarRegistrationSchema = new mongoose.Schema({
  webinar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webinar',
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
  zoomLinkSent: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebinarRegistration', webinarRegistrationSchema);
