const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'general'
  },
  metaAdImpressions: {
    type: Number,
    default: 0
  },
  metaAdReach: {
    type: Number,
    default: 0
  },
  metaInteractions: {
    type: Number,
    default: 0
  },
  metaPageEngagement: {
    type: Number,
    default: 0
  },
  metaPostReactions: {
    type: Number,
    default: 0
  },
  metaAdAccountId: {
    type: String,
    default: ''
  },
  metaAccessToken: {
    type: String,
    default: ''
  },
  lastSyncedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
