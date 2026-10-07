const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

const bottleProduct = {
  name: "Ascension Money Magnet Energy Water Bottle",
  category: "Energy Bottles",
  pricing: 1777,
  stock: 50,
  images: ["/uploads/money_magnet_water_bottle.jpg"],
  description: `Tagline: Hydrate • Harmonize • Attract • Manifest | Charge Your Water With Limitless Abundance

Transform every drop of water into a high-vibrational elixir of wealth, flow, and prosperity with the Ascension Money Magnet Energy Glass Water Bottle. Water is a powerful energetic conductor that absorbs cosmic intentions, geometric frequencies, and vibrational codes. This consecrated glass bottle is inscribed with sacred Grabovoi wealth numbers, divine switchwords, 7-chakra alignment symbols, and ancient sacred geometry.

Sacred Codes & Inscriptions:
1. Master Grabovoi Codes:
   - 520: Attracting Unexpected Financial Miracles & Rapid Manifestation
   - 741: Instant Solutions, Problem Solving & Clearing Blocks
   - 808: Infinite Financial Abundance & Universal Flow
   - 9213140, 71,427,321,893, 706485425: Divine Wealth Acceleration & Magnetic Protection
2. Sacred Switchwords:
   - "NO-COUNT-DIVINE-MONEY-WITH-EASE": Dissolves scarcity mindset and welcomes effortless continuous financial flow.
   - "RUSA-COUNT-ON-DIVINE-THANKS": Deepens frequency of divine gratitude to multiply financial blessings.
3. Sacred Geometry & Yantra Vortex:
   - Sacred 4-petaled wealth vortex emblem to spin vital life-force energy (Prana).
4. Divine Protection & 7-Chakra Alignment:
   - Sacred Om (ॐ) & Trishul symbols for aura shielding.
   - All 7 Chakra energy centers etched vertically along the side to align your subtle body while hydrating.

Why Use:
- Energetically charges drinking water with frequencies of abundance, success, and prosperity
- Clears subconscious money blocks and negative emotional memory from water molecules
- Aligns all 7 chakras for holistic vitality, mental clarity, and high vibration
- Crafted with premium high-grade borosilicate clear glass and stainless steel cap
- Eco-friendly, non-toxic, BPA-free, and reusable daily wellness tool

How to Use & Charge:
1. Fill with fresh drinking water and let it rest for 10–15 minutes to absorb sacred vibrational codes.
2. Hold the bottle with both hands, close your eyes, and set your daily abundance affirmation.
3. Drink mindfully throughout your day, visualizing liquid golden light and prosperity filling every cell of your body.

Affirmation:
"With every sip, I align with divine abundance, effortless wealth, vibrant health, and infinite peace."`
};

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Upsert into MongoDB
    let existing = await Product.findOne({
      $or: [
        { name: bottleProduct.name },
        { name: { $regex: /money magnet.*bottle/i } }
      ]
    });

    if (existing) {
      existing.name = bottleProduct.name;
      existing.description = bottleProduct.description;
      existing.pricing = bottleProduct.pricing;
      existing.category = bottleProduct.category;
      existing.stock = bottleProduct.stock;
      existing.images = bottleProduct.images;
      await existing.save();
      console.log(`Updated existing product in DB: ${existing.name} (₹${existing.pricing})`);
    } else {
      existing = await Product.create(bottleProduct);
      console.log(`Created new product in DB: ${existing.name} (₹${existing.pricing}) [ID: ${existing._id}]`);
    }

    // 2. Sync to extracted_products.json
    const extractedPath = path.join(__dirname, 'extracted_products.json');
    let fileProducts = [];
    if (fs.existsSync(extractedPath)) {
      try {
        fileProducts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
      } catch (e) {
        console.error('Error reading extracted_products.json:', e);
      }
    }

    const idx = fileProducts.findIndex(p => p.name === bottleProduct.name || /money magnet.*bottle/i.test(p.name));
    if (idx !== -1) {
      fileProducts[idx] = { ...fileProducts[idx], ...bottleProduct };
    } else {
      fileProducts.push(bottleProduct);
    }

    fs.writeFileSync(extractedPath, JSON.stringify(fileProducts, null, 2), 'utf8');
    console.log('Successfully synced Money Magnet Water Bottle to extracted_products.json.');

    process.exit(0);
  } catch (err) {
    console.error('Error adding product:', err);
    process.exit(1);
  }
}

run();
