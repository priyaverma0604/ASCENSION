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
    default: 39079
  },
  metaAdReach: {
    type: Number,
    default: 35000
  },
  metaInteractions: {
    type: Number,
    default: 11618
  },
  metaPageEngagement: {
    type: Number,
    default: 39079
  },
  metaPostReactions: {
    type: Number,
    default: 11459
  },
  metaAdAccountId: {
    type: String,
    default: ''
  },
  metaAccessToken: {
    type: String,
    default: ''
  },
  metaCampaignName: {
    type: String,
    default: 'SALES_ASCENSION_VYAPAAR'
  },
  metaSyncStatus: {
    type: String,
    enum: ['idle', 'connected', 'error', 'dynamic_auto'],
    default: 'dynamic_auto'
  },
  metaSyncError: {
    type: String,
    default: ''
  },
  metaAutoSync: {
    type: Boolean,
    default: true
  },
  lastSyncedAt: {
    type: Date,
    default: () => new Date()
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
