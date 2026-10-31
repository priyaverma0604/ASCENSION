const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  console.error('MONGODB_URI is not set in environment.');
  process.exit(1);
}

const catalogueProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'catalogue_products_2026.json'), 'utf-8')
);

async function seedCatalogueProducts() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    const categoryName = 'Candles & Hampers (Women Empowerment)';

    // 1. Remove any previous items in this category or with the same names to avoid duplicates
    const names = catalogueProducts.map(p => p.name);
    const deleteResult = await Product.deleteMany({
      $or: [
        { category: categoryName },
        { name: { $in: names } }
      ]
    });
    console.log(`Cleaned up ${deleteResult.deletedCount} previous catalogue items.`);

    // 2. Insert all 33 products
    const inserted = await Product.insertMany(catalogueProducts);
    console.log(`Successfully seeded ${inserted.length} new items into category: "${categoryName}":`);
    inserted.forEach((p, i) => {
      console.log(`  ${i + 1}. [₹${p.pricing}] ${p.name}`);
    });

    // 3. Update extracted_products.json with these 33 products so the master JSON has all products
    const masterJsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(masterJsonPath)) {
      const existing = JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8'));
      const existingFiltered = existing.filter(p => !names.includes(p.name) && p.category !== categoryName);
      const combined = [...existingFiltered, ...catalogueProducts];
      fs.writeFileSync(masterJsonPath, JSON.stringify(combined, null, 2), 'utf-8');
      console.log(`Updated master extracted_products.json! Total products in file: ${combined.length}`);
    }

    const totalInDb = await Product.countDocuments();
    const totalInCat = await Product.countDocuments({ category: categoryName });
    console.log(`\nVerification:`);
    console.log(`- Products in "${categoryName}": ${totalInCat}`);
    console.log(`- Total Products in Database: ${totalInDb}`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
}

seedCatalogueProducts();
