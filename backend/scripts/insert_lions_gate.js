const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Webinar = require('../models/Webinar');

dotenv.config({ path: path.join(__dirname, '../.env') });

const deleteLionsGateWebinar = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const res = await Webinar.deleteMany({
      title: { $regex: /lion/i }
    });

    console.log(`Successfully deleted ${res.deletedCount} Lion's Gate webinar(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Error deleting webinar:', err);
    process.exit(1);
  }
};

deleteLionsGateWebinar();
