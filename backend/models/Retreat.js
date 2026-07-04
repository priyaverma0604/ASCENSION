const mongoose = require('mongoose');

const retreatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a retreat title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a retreat description']
  },
  itinerary: [
    {
      day: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  images: [
    {
      type: String
    }
  ],
  pricing: {
    type: Number,
    required: [true, 'Please specify pricing in INR']
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify retreat capacity']
  },
  interestedUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      message: { type: String },
      bookedStatus: {
        type: String,
        enum: ['inquiry', 'booked', 'cancelled'],
        default: 'inquiry'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Retreat', retreatSchema);
