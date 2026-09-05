const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Webinar = require('../models/Webinar');

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGO_URI is not set in environment.');
  process.exit(1);
}

const WHATSAPP_LINK = 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16';

async function updateAncestralWebinar() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    // Find all webinars matching Ancestral
    const result = await Webinar.updateMany(
      { title: /Ancestral/i },
      { $set: { whatsappGroupLink: WHATSAPP_LINK } }
    );

    console.log(`Updated ${result.modifiedCount} webinar(s) with WhatsApp group link: ${WHATSAPP_LINK}`);

    const webinars = await Webinar.find({ title: /Ancestral/i });
    webinars.forEach((w) => {
      console.log(`- Title: "${w.title}" | WhatsApp Group: ${w.whatsappGroupLink}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating webinar WhatsApp link:', error);
    process.exit(1);
  }
}

updateAncestralWebinar();
