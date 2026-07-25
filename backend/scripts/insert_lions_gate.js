const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Webinar = require('../models/Webinar');

dotenv.config({ path: path.join(__dirname, '../.env') });

const insertLionsGateWebinar = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Remove any existing webinar with the same title to prevent duplicates
    await Webinar.deleteMany({
      title: "Lion's Gate Portal Webinar: 8:8 Gateway of Abundance & Awakening"
    });

    const newWebinar = new Webinar({
      title: "Lion's Gate Portal Webinar: 8:8 Gateway of Abundance & Awakening",
      shortDescription: "Step into the powerful energies of the Lion's Gate Portal 2026. Discover how this cosmic alignment opens the doors to manifestation, spiritual awakening, and divine transformation.",
      detailedDescription: "The Lion's Gate Portal reaches its peak on August 8th (8:8), bringing a massive influx of high-frequency cosmic light. In this powerful webinar, Sonali Bhasin Kumar will guide you through energy clearing, manifestation alignments, and DNA activation to help you co-create abundance and spiritual transformation in this lifetime.",
      speakerName: "Sonali Bhasin Kumar",
      date: new Date('2026-08-08T18:00:00Z'), // August 8, 2026 at 6:00 PM UTC / 11:30 PM IST (or custom)
      time: "6:00 PM - 7:30 PM IST",
      duration: "90 minutes",
      price: 2100,
      coverImage: "", 
      upiQrCodeImage: "/uploads/default_upi_qr.jpg",
      upiId: "sonalibhasinkumar@ptaxis",
      mobileNumber: "9999999999",
      zoomLink: "https://zoom.us/mock-lions-gate-link",
      maxSeats: 100,
      status: "Upcoming",
      isWebinar: true
    });

    const saved = await newWebinar.save();
    console.log('Successfully inserted Lion\'s Gate Portal Webinar:', saved);
    process.exit(0);
  } catch (err) {
    console.error('Error inserting webinar:', err);
    process.exit(1);
  }
};

insertLionsGateWebinar();
