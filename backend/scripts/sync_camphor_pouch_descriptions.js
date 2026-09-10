const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

async function syncDescriptions() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const mapping = [
      {
        pouchName: 'Ascension Abundance Camphor Pouch',
        normalName: 'Ascension Abundance Camphor'
      },
      {
        pouchName: 'Ascension Health Camphor Pouch',
        normalName: 'Ascension Health Camphor'
      },
      {
        pouchName: 'Ascension Love & Peace Camphor Pouch',
        normalName: 'Ascension Love & Peace Camphor'
      },
      {
        pouchName: 'Ascension Cleansing Camphor Pouch',
        normalName: 'Ascension Cleansing Camphor'
      },
      {
        pouchName: 'Ascension Protection Camphor Pouch',
        normalName: 'Ascension Protection Camphor'
      }
    ];

    // 1. Update in MongoDB
    for (const pair of mapping) {
      const normalProd = await Product.findOne({ name: pair.normalName });
      if (!normalProd) {
        console.error(`Normal product not found: ${pair.normalName}`);
        continue;
      }

      const res = await Product.findOneAndUpdate(
        { name: pair.pouchName },
        { $set: { description: normalProd.description } },
        { new: true }
      );

      if (res) {
        console.log(`Updated description for ${res.name} (Matched with ${pair.normalName})`);
      } else {
        console.error(`Pouch product not found in DB: ${pair.pouchName}`);
      }
    }

    // 2. Update extracted_products.json
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      
      for (const pair of mapping) {
        const normalItem = productsData.find(p => p.name === pair.normalName);
        const pouchIdx = productsData.findIndex(p => p.name === pair.pouchName);
        
        if (normalItem && pouchIdx !== -1) {
          productsData[pouchIdx].description = normalItem.description;
          console.log(`Synced description in extracted_products.json for ${pair.pouchName}`);
        }
      }

      fs.writeFileSync(jsonPath, JSON.stringify(productsData, null, 2), 'utf-8');
      console.log('Successfully saved extracted_products.json.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error syncing descriptions:', err);
    process.exit(1);
  }
}

syncDescriptions();
