const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Program = require('../models/Program');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrationData = [
  {
    title: "Ancestral Healing Workshop",
    originalPrice: 29999,
    sellingPrice: 19999
  },
  {
    title: "Guided Meditations",
    originalPrice: 2100,
    sellingPrice: 2100
  },
  {
    title: "Angel Therapy workshops",
    originalPrice: 41111,
    sellingPrice: 17777
  },
  {
    title: "21 days affirmations program",
    originalPrice: 3333,
    sellingPrice: 1555
  },
  {
    title: "30 days gratitude program",
    originalPrice: 2222,
    sellingPrice: 1111
  },
  {
    title: "21 days mirror work for self love program",
    originalPrice: 2222,
    sellingPrice: 888
  },
  {
    title: "21 days prayers",
    originalPrice: 2222,
    sellingPrice: 777
  },
  {
    title: "21 days release work program",
    originalPrice: 3333,
    sellingPrice: 1555
  },
  {
    title: "21 days forgiveness program",
    originalPrice: 3333,
    sellingPrice: 1555
  }
];

const migrateProgramsPricing = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const activePrograms = await Program.find({});
    console.log(`Found ${activePrograms.length} active programs in database.`);

    for (const program of activePrograms) {
      // Find matching item in migrationData by case-insensitive title and trimmed spaces
      const match = migrationData.find(item => 
        item.title.toLowerCase().trim() === program.title.toLowerCase().trim()
      );

      if (match) {
        program.originalPrice = match.originalPrice;
        program.sellingPrice = match.sellingPrice;
        program.pricing = match.sellingPrice; // Synchronize pricing field

        await program.save();
        console.log(`Successfully migrated program pricing for: "${program.title}" -> Original: ${match.originalPrice}, Selling: ${match.sellingPrice}`);
      } else {
        // Default migration values if not matched
        program.originalPrice = program.pricing;
        program.sellingPrice = program.pricing;
        await program.save();
        console.log(`Program "${program.title}" not matched. Assigned originalPrice = sellingPrice = ${program.pricing}.`);
      }
    }

    console.log('Program pricing migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateProgramsPricing();
