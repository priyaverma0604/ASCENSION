const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

async function updateZodiacBraceletPrices() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Find all zodiac sign crystal bracelets
    const zodiacNames = [
      "Ascension Aries Zodiac Sign Crystal Bracelet",
      "Ascension Taurus Zodiac Sign Crystal Bracelet",
      "Ascension Gemini Zodiac Sign Crystal Bracelet",
      "Ascension Cancer Zodiac Sign Crystal Bracelet",
      "Ascension Leo Zodiac Sign Crystal Bracelet",
      "Ascension Virgo Zodiac Sign Crystal Bracelet",
      "Ascension Libra Zodiac Sign Crystal Bracelet",
      "Ascension Scorpio Zodiac Sign Crystal Bracelet",
      "Ascension Sagittarius Zodiac Sign Crystal Bracelet",
      "Ascension Capricorn Zodiac Sign Crystal Bracelet",
      "Ascension Aquarius Zodiac Sign Crystal Bracelet",
      "Ascension Pisces Zodiac Sign Crystal Bracelet"
    ];

    // 1. Update in MongoDB
    const result = await Product.updateMany(
      {
        $or: [
          { name: { $in: zodiacNames } },
          { name: { $regex: /zodiac.*bracelet/i } }
        ]
      },
      { $set: { pricing: 1999 } }
    );
    console.log(`Updated ${result.modifiedCount} Zodiac bracelet documents in MongoDB to ₹1999.`);

    // Verify in DB
    const updatedProducts = await Product.find({
      $or: [
        { name: { $in: zodiacNames } },
        { name: { $regex: /zodiac.*bracelet/i } }
      ]
    });
    console.log(`Verified ${updatedProducts.length} Zodiac bracelets in DB:`);
    updatedProducts.forEach(p => console.log(` - ${p.name}: ₹${p.pricing}`));

    // 2. Update extracted_products.json
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      let jsonUpdatedCount = 0;
      for (const p of currentList) {
        const isZodiacBracelet = zodiacNames.includes(p.name) || (p.name && /zodiac.*bracelet/i.test(p.name));
        if (isZodiacBracelet) {
          p.pricing = 1999;
          jsonUpdatedCount++;
        }
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log(`Successfully updated ${jsonUpdatedCount} zodiac bracelets in extracted_products.json to ₹1999.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error updating zodiac bracelet prices:', err);
    process.exit(1);
  }
}

updateZodiacBraceletPrices();
