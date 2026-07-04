const mongoose = require('mongoose');

const productCategories = [
  'Crystals', 'Lamps', 'Candles', 'Crystal Trees', 'Pendants', 
  'Bracelets', 'Healing Stones', 'Selenite Products', 'Trays', 
  'Decorative Pieces', 'Wax Melts', 'Bath Salts', 'Healing Oils',
  'Healing Camphor', 'Wax Tablets', 'Sage Leaves'
];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  pricing: {
    type: Number,
    required: [true, 'Please specify pricing in INR']
  },
  images: [
    {
      type: String
    }
  ],
  category: {
    type: String,
    required: [true, 'Please select a product category'],
    enum: productCategories
  },
  stock: {
    type: Number,
    required: [true, 'Please specify stock count'],
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        required: true
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

module.exports = mongoose.model('Product', productSchema);
