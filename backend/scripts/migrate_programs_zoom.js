const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Program = require('../models/Program');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateProgramsZoom = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // We will set zoomLink for Ancestral Healing Workshop and Angel Therapy workshops
    const ancestralHealing = await Program.findOne({ title: /Ancestral Healing Workshop/i });
    if (ancestralHealing) {
      ancestralHealing.zoomLink = "https://zoom.us/j/1234567890";
      await ancestralHealing.save();
      console.log('Updated Zoom link for Ancestral Healing Workshop');
    } else {
      console.log('Ancestral Healing Workshop not found');
    }

    const angelTherapy = await Program.findOne({ title: /Angel Therapy workshops/i });
    if (angelTherapy) {
      angelTherapy.zoomLink = "https://zoom.us/j/1234567890";
      await angelTherapy.save();
      console.log('Updated Zoom link for Angel Therapy workshops');
    } else {
      console.log('Angel Therapy workshops not found');
    }

    console.log('Zoom link migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateProgramsZoom();
