const mongoose = require('mongoose');

const programRegistrationSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add name']
  },
  email: {
    type: String,
    required: [true, 'Please add email']
  },
  phone: {
    type: String,
    required: [true, 'Please add phone']
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgramRegistration', programRegistrationSchema);
