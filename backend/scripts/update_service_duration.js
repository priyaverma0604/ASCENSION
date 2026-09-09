const mongoose = require('mongoose');
require('dotenv').config();

const updateServicesDuration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const Service = require('../models/Service');
    const result = await Service.updateMany({}, { duration: 30 });
    console.log(`Updated ${result.modifiedCount} services to 30 minutes duration.`);

    const allServices = await Service.find({}, 'title duration pricing');
    console.log('Services in Database:');
    allServices.forEach(s => console.log(`- ${s.title}: ${s.duration} mins (₹${s.pricing})`));

    process.exit(0);
  } catch (error) {
    console.error('Error updating service duration:', error);
    process.exit(1);
  }
};

updateServicesDuration();
