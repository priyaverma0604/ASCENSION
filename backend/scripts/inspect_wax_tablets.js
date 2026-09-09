const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/ASCENSION/backend/.env' });
const Product = require('../models/Product');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = await Product.find({
    category: { $in: ['Wax Tablets', 'Sage Leaves'] }
  });
  console.log('Found:', JSON.stringify(products.map(p => ({ id: p._id, name: p.name, category: p.category, pricing: p.pricing, images: p.images })), null, 2));
  process.exit(0);
}

check();
