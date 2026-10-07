const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    default: null
  },
  userEmail: {
    type: String,
    default: null
  },
  pagePath: {
    type: String,
    required: true,
    index: true
  },
  pageTitle: {
    type: String,
    default: ''
  },
  referrer: {
    type: String,
    default: ''
  },
  // UTM & Campaign / Meta tracking fields
  utmSource: {
    type: String,
    default: ''
  },
  utmMedium: {
    type: String,
    default: ''
  },
  utmCampaign: {
    type: String,
    default: ''
  },
  utmContent: {
    type: String,
    default: ''
  },
  utmTerm: {
    type: String,
    default: ''
  },
  fbclid: {
    type: String,
    default: ''
  },
  isMetaTraffic: {
    type: Boolean,
    default: false,
    index: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  deviceType: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Desktop'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for analytics queries
visitLogSchema.index({ isMetaTraffic: 1, timestamp: -1 });
visitLogSchema.index({ utmCampaign: 1, timestamp: -1 });
visitLogSchema.index({ utmSource: 1, timestamp: -1 });

// Auto expire raw logs older than 90 days to keep DB performant and lightweight
visitLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('VisitLog', visitLogSchema);

