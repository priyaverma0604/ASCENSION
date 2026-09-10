const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

async function updateAllProductPrices() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // 1. Get all products from DB
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products in DB.`);

    for (const p of allProducts) {
      const name = p.name.toLowerCase();
      const cat = p.category ? p.category.toLowerCase() : '';
      let newPrice = p.pricing;

      if (name.includes('boat')) {
        // Boat Candles: Small size 475 (Big size 725 in size variant)
        newPrice = 475;
      } else if (name.includes('cone')) {
        // Camphor Cones: 350
        newPrice = 350;
      } else if (name.includes('pouch')) {
        // Camphor Pouches: 550
        newPrice = 550;
      } else if (cat.includes('candle') || name.includes('candle')) {
        // Normal Candles: 375
        newPrice = 375;
      } else if (cat.includes('wax tablet') || name.includes('wax tablet')) {
        // Wax Tablets: 250 each
        newPrice = 250;
      } else if (cat.includes('salt') || name.includes('salt')) {
        // Bath Salts: 350 each
        newPrice = 350;
      } else if (cat.includes('camphor') || name.includes('camphor')) {
        // Healing Camphor: 650 (bottle one)
        newPrice = 650;
      } else if (cat.includes('oil') || name.includes('oil')) {
        // Healing Oils: 250 each
        newPrice = 250;
      }

      p.pricing = newPrice;
      await p.save();
      console.log(`Updated ${p.name} [${p.category}] -> ₹${newPrice}`);
    }

    // 2. Update extracted_products.json
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      for (const p of currentList) {
        const name = p.name.toLowerCase();
        const cat = p.category ? p.category.toLowerCase() : '';
        let newPrice = p.pricing;

        if (name.includes('boat')) {
          newPrice = 475;
        } else if (name.includes('cone')) {
          newPrice = 350;
        } else if (name.includes('pouch')) {
          newPrice = 550;
        } else if (cat.includes('candle') || name.includes('candle')) {
          newPrice = 375;
        } else if (cat.includes('wax tablet') || name.includes('wax tablet')) {
          newPrice = 250;
        } else if (cat.includes('salt') || name.includes('salt')) {
          newPrice = 350;
        } else if (cat.includes('camphor') || name.includes('camphor')) {
          newPrice = 650;
        } else if (cat.includes('oil') || name.includes('oil')) {
          newPrice = 250;
        }

        p.pricing = newPrice;
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log('Successfully updated all prices in extracted_products.json');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error updating product prices:', err);
    process.exit(1);
  }
}

updateAllProductPrices();
