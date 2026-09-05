const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a webinar title'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  speakerName: {
    type: String,
    required: [true, 'Please specify the speaker name']
  },
  date: {
    type: Date,
    required: [true, 'Please specify the webinar date']
  },
  time: {
    type: String,
    required: [true, 'Please specify the webinar time (e.g., 4:00 PM - 5:30 PM)']
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration (e.g., 90 minutes)']
  },
  price: {
    type: Number,
    required: [true, 'Please specify pricing in INR'],
    default: 0
  },
  coverImage: {
    type: String,
    default: ''
  },
  upiQrCodeImage: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    required: [true, 'Please specify the UPI ID for manual payment']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please specify the mobile number associated with the UPI']
  },
  zoomLink: {
    type: String,
    required: [true, 'Please add the Zoom Meeting Link']
  },
  meetingId: {
    type: String,
    default: ''
  },
  passcode: {
    type: String,
    default: ''
  },
  meetingChatLink: {
    type: String,
    default: ''
  },
  oneTapMobile: {
    type: String,
    default: ''
  },
  joinBySip: {
    type: String,
    default: ''
  },
  maxSeats: {
    type: Number,
    required: [true, 'Please specify the maximum capacity']
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  isWebinar: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Webinar', webinarSchema);
