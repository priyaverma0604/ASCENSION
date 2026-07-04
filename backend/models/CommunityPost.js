const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['update', 'announcement', 'event'],
    default: 'update',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a post title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add post content']
  },
  image: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
