const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

// 1. Copy images from uploaded media to backend and frontend uploads directories
const imagesToCopy = [
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/6785c82e-cfda-46cd-a51d-c22842e5a47f/.user_uploaded/media_1789047945174.jpg",
    filename: "abundance_camphor_pouch.jpg"
  },
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/6785c82e-cfda-46cd-a51d-c22842e5a47f/.user_uploaded/media_1789047966515.jpg",
    filename: "health_camphor_pouch.jpg"
  },
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/6785c82e-cfda-46cd-a51d-c22842e5a47f/.user_uploaded/media_1789047980958.jpg",
    filename: "love_peace_camphor_pouch.jpg"
  },
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/6785c82e-cfda-46cd-a51d-c22842e5a47f/.user_uploaded/media_1789047992888.jpg",
    filename: "cleansing_camphor_pouch.jpg"
  },
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/6785c82e-cfda-46cd-a51d-c22842e5a47f/.user_uploaded/media_1789048210592.jpg",
    filename: "protection_camphor_pouch.jpg"
  }
];

for (const item of imagesToCopy) {
  const backendDest = path.join(__dirname, '..', 'uploads', item.filename);
  const frontendDest = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', item.filename);

  [backendDest, frontendDest].forEach(d => {
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.copyFileSync(item.src, d);
    console.log(`Copied ${item.src} -> ${d} (size: ${fs.statSync(d).size})`);
  });
}

const jsonPath = path.join(__dirname, 'extracted_products.json');
const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const normalCamphors = {
  Cleansing: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Cleansing') && !p.name.includes('Cone') && !p.name.includes('Pouch')),
  Protection: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Protection') && !p.name.includes('Cone') && !p.name.includes('Pouch')),
  Abundance: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Abundance') && !p.name.includes('Cone') && !p.name.includes('Pouch')),
  Health: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Health') && !p.name.includes('Cone') && !p.name.includes('Pouch')),
  LovePeace: productsData.find(p => p.category === 'Healing Camphor' && p.name.includes('Love & Peace') && !p.name.includes('Cone') && !p.name.includes('Pouch'))
};

const newCamphorPouches = [
  {
    name: "Ascension Abundance Camphor Pouch",
    category: "Healing Camphor",
    pricing: 550,
    stock: 50,
    images: ["/uploads/abundance_camphor_pouch.jpg"],
    description: normalCamphors.Abundance ? normalCamphors.Abundance.description : ''
  },
  {
    name: "Ascension Health Camphor Pouch",
    category: "Healing Camphor",
    pricing: 550,
    stock: 50,
    images: ["/uploads/health_camphor_pouch.jpg"],
    description: normalCamphors.Health ? normalCamphors.Health.description : ''
  },
  {
    name: "Ascension Love & Peace Camphor Pouch",
    category: "Healing Camphor",
    pricing: 550,
    stock: 50,
    images: ["/uploads/love_peace_camphor_pouch.jpg"],
    description: normalCamphors.LovePeace ? normalCamphors.LovePeace.description : ''
  },
  {
    name: "Ascension Cleansing Camphor Pouch",
    category: "Healing Camphor",
    pricing: 550,
    stock: 50,
    images: ["/uploads/cleansing_camphor_pouch.jpg"],
    description: normalCamphors.Cleansing ? normalCamphors.Cleansing.description : ''
  },
  {
    name: "Ascension Protection Camphor Pouch",
    category: "Healing Camphor",
    pricing: 550,
    stock: 50,
    images: ["/uploads/protection_camphor_pouch.jpg"],
    description: normalCamphors.Protection ? normalCamphors.Protection.description : ''
  }
];

async function addPouches() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    for (const pouch of newCamphorPouches) {
      // 1. Update in-memory JSON array
      const existingIdx = productsData.findIndex(p => p.name === pouch.name);
      if (existingIdx >= 0) {
        productsData[existingIdx] = pouch;
      } else {
        productsData.push(pouch);
      }

      // 2. Upsert in MongoDB
      const res = await Product.findOneAndUpdate(
        { name: pouch.name },
        { $set: pouch },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Upserted: ${res.name} (Price: ₹${res.pricing}, Category: ${res.category}, Image: ${res.images[0]})`);
    }

    // Write back to extracted_products.json
    fs.writeFileSync(jsonPath, JSON.stringify(productsData, null, 2), 'utf-8');
    console.log(`Updated extracted_products.json with ${productsData.length} total products.`);

    const countInDb = await Product.countDocuments();
    console.log(`Total products in database: ${countInDb}`);

    process.exit(0);
  } catch (err) {
    console.error('Error adding camphor pouches:', err);
    process.exit(1);
  }
}

addPouches();
