const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Workshop = require('../models/Workshop');

dotenv.config({ path: path.join(__dirname, '../.env') });

const insertWorkshop = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Remove any existing workshops with the same name on that date to prevent duplicates
    await Workshop.deleteMany({
      title: "Chakra Balance & Sound Bath Masterclass",
      date: new Date('2026-07-12T17:00:00Z')
    });

    const newWorkshop = new Workshop({
      title: "Chakra Balance & Sound Bath Masterclass",
      description: "Join Sonali Bhasin Kumar for a high-frequency alignment session using Tibetan sound bowls and subconscious clearing to restore mental harmony and energetic balance.",
      date: new Date('2026-07-12T17:00:00Z'), // This Sunday, July 12, 2026
      time: "5:00 PM - 6:30 PM IST",
      pricing: 200,
      capacity: 50
    });

    const saved = await newWorkshop.save();
    console.log('Successfully inserted upcoming workshop:', saved);
    process.exit(0);
  } catch (err) {
    console.error('Error inserting workshop:', err);
    process.exit(1);
  }
};

insertWorkshop();
