const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGO_URI is not set in environment.');
  process.exit(1);
}

const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'extracted_products.json'), 'utf-8')
);

async function replaceProducts() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    // 1. Remove all old products
    const delResult = await Product.deleteMany({});
    console.log(`Deleted ${delResult.deletedCount} old products.`);

    // 2. Insert the exact 20 new products
    const inserted = await Product.insertMany(productsData);
    console.log(`Successfully inserted ${inserted.length} new healing products:`);
    inserted.forEach((p, i) => {
      console.log(`${i + 1}. [${p.category}] ${p.name}`);
    });

    const totalInDb = await Product.countDocuments();
    console.log(`Total Products in Database now: ${totalInDb}`);

    process.exit(0);
  } catch (err) {
    console.error('Error replacing products in DB:', err);
    process.exit(1);
  }
}

replaceProducts();
