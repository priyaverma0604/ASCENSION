const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous'
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  amount: {
    type: Number,
    required: [true, 'Please specify donation amount in INR']
  },
  transactionId: {
    type: String,
    required: [true, 'Please specify transaction/reference ID']
  },
  paymentType: {
    type: String,
    enum: ['Razorpay', 'UPI_QR'],
    default: 'UPI_QR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
