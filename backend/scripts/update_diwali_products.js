const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  console.error('MONGODB_URI not found in env');
  process.exit(1);
}

const rawCatalogue = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'catalogue_products_2026.json'), 'utf-8')
);

// Filter out the Duo offer product (item 9)
const filteredProducts = rawCatalogue
  .filter(p => !p.name.includes('Mix & Match Candle Duo'))
  .map(p => {
    // Only keep the 1st image
    const singleImage = p.images && p.images.length > 0 ? [p.images[0]] : [];
    
    // Check if this is one of the 6 signature small candles
    const isSmallCandle = [
      'Rosewater Charm',
      'Sapphire Serenity',
      'Ruby Elegance',
      'Lavender Peacock Elegance',
      'Amber Grace',
      'Golden Grace'
    ].some(name => p.name.includes(name));

    let updatedDesc = p.description;
    if (isSmallCandle) {
      updatedDesc = `✨ DIWALI SPECIAL OFFER: Buy any 2 small candles for ₹999!\n\n` + p.description;
    }

    return {
      ...p,
      category: 'Diwali Special (Women Empowerment)',
      images: singleImage,
      description: updatedDesc
    };
  });

console.log(`Processed ${filteredProducts.length} clean Diwali Special products with 1 high-res image each.`);

// Save back to catalogue_products_2026.json
fs.writeFileSync(
  path.join(__dirname, 'catalogue_products_2026.json'),
  JSON.stringify(filteredProducts, null, 2),
  'utf-8'
);

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Remove old "Candles & Hampers (Women Empowerment)" and any previous "Diwali Special (Women Empowerment)"
    const del1 = await Product.deleteMany({
      category: { $in: ['Candles & Hampers (Women Empowerment)', 'Diwali Special (Women Empowerment)'] }
    });
    // Also remove by name in case any had old category
    const names = filteredProducts.map(p => p.name);
    names.push('Ascension Mix & Match Candle Duo (Set of 2)');
    const del2 = await Product.deleteMany({ name: { $in: names } });

    console.log(`Removed ${del1.deletedCount + del2.deletedCount} old items.`);

    // Insert 32 products
    const inserted = await Product.insertMany(filteredProducts);
    console.log(`Successfully inserted ${inserted.length} products under category "Diwali Special (Women Empowerment)"!`);

    // Update master extracted_products.json
    const masterPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(masterPath)) {
      const existing = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
      const cleanedExisting = existing.filter(p => 
        !p.name.includes('Mix & Match Candle Duo') &&
        p.category !== 'Candles & Hampers (Women Empowerment)' &&
        p.category !== 'Diwali Special (Women Empowerment)' &&
        !names.includes(p.name)
      );
      const combined = [...cleanedExisting, ...filteredProducts];
      fs.writeFileSync(masterPath, JSON.stringify(combined, null, 2), 'utf-8');
      console.log(`Updated master extracted_products.json with ${combined.length} total products.`);
    }

    const totalNow = await Product.countDocuments();
    const diwaliNow = await Product.countDocuments({ category: 'Diwali Special (Women Empowerment)' });
    console.log(`Verification:`);
    console.log(`- Diwali Special count: ${diwaliNow}`);
    console.log(`- Total DB products: ${totalNow}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
