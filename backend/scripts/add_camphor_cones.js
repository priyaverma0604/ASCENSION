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

const jsonPath = path.join(__dirname, 'extracted_products.json');
const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const normalCamphors = {
  Cleansing: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Cleansing') && !p.name.includes('Cone')),
  Protection: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Protection') && !p.name.includes('Cone')),
  Abundance: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Abundance') && !p.name.includes('Cone')),
  LovePeace: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Love & Peace') && !p.name.includes('Cone'))
};

const newCones = [
  {
    name: "Ascension Cleansing Camphor Cone",
    category: "Healing Camphor",
    pricing: 350,
    stock: 50,
    images: ["/uploads/cleansing_camphor_cone.jpg"],
    description: normalCamphors.Cleansing ? normalCamphors.Cleansing.description.replace(/Ascension Cleansing Camphor/g, 'Ascension Cleansing Camphor Cone') : ''
  },
  {
    name: "Ascension Protection Camphor Cone",
    category: "Healing Camphor",
    pricing: 350,
    stock: 50,
    images: ["/uploads/protection_camphor_cone.jpg"],
    description: normalCamphors.Protection ? normalCamphors.Protection.description.replace(/Ascension Protection Camphor/g, 'Ascension Protection Camphor Cone') : ''
  },
  {
    name: "Ascension Abundance Camphor Cone",
    category: "Healing Camphor",
    pricing: 350,
    stock: 50,
    images: ["/uploads/abundance_camphor_cone.jpg"],
    description: normalCamphors.Abundance ? normalCamphors.Abundance.description.replace(/Ascension Abundance Camphor/g, 'Ascension Abundance Camphor Cone') : ''
  },
  {
    name: "Ascension Love & Peace Camphor Cone",
    category: "Healing Camphor",
    pricing: 350,
    stock: 50,
    images: ["/uploads/love_peace_camphor_cone.jpg"],
    description: normalCamphors.LovePeace ? normalCamphors.LovePeace.description.replace(/Ascension Love & Peace Camphor/g, 'Ascension Love & Peace Camphor Cone') : ''
  }
];

async function addCones() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    for (const cone of newCones) {
      // 1. Update in-memory JSON array
      const existingIdx = productsData.findIndex(p => p.name === cone.name);
      if (existingIdx >= 0) {
        productsData[existingIdx] = cone;
      } else {
        productsData.push(cone);
      }

      // 2. Upsert in MongoDB
      const res = await Product.findOneAndUpdate(
        { name: cone.name },
        { $set: cone },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Upserted: ${res.name} (Price: ₹${res.pricing}, Category: ${res.category})`);
    }

    // Write back to extracted_products.json
    fs.writeFileSync(jsonPath, JSON.stringify(productsData, null, 2), 'utf-8');
    console.log(`Updated extracted_products.json with ${productsData.length} total products.`);

    const countInDb = await Product.countDocuments();
    console.log(`Total products in database: ${countInDb}`);

    process.exit(0);
  } catch (err) {
    console.error('Error adding camphor cones:', err);
    process.exit(1);
  }
}

addCones();
