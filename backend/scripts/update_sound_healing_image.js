const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Service = require('../models/Service');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateSoundHealingImage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const result = await Service.updateOne(
      { title: "Sound Healing" },
      { image: "/uploads/sound_healing_service.png" }
    );

    console.log('Update result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error updating Sound Healing image:', err);
    process.exit(1);
  }
};

updateSoundHealingImage();
