const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkNavratri() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  await mongoose.connect(uri);
  
  const Program = require('../models/Program');
  const Assignment = require('../models/Assignment');
  const User = require('../models/User');
  const ProgramRegistration = require('../models/ProgramRegistration');

  const navratriProg = await Program.findById('6a4963f49e941f93f91f5ac5');
  console.log('--- NAVRATRI PROGRAM ---');
  console.log('Title:', navratriProg?.title);
  console.log('Enrolled Users:', navratriProg?.enrolledUsers);
  console.log('Pricing:', navratriProg?.pricing, 'Selling Price:', navratriProg?.sellingPrice);

  const assignments = await Assignment.find({ program: '6a4963f49e941f93f91f5ac5' }).sort({ dayNumber: 1 });
  console.log('\n--- NAVRATRI ASSIGNMENTS (' + assignments.length + ') ---');
  assignments.forEach(a => {
    console.log(`Day ${a.dayNumber}: ${a.title} | Duration: ${a.audioDuration} | Audio: ${a.audioUrl ? 'Yes (' + a.audioUrl.substring(0, 40) + '...)' : 'No'} | Status: ${a.status}`);
  });

  const registrations = await ProgramRegistration.find({ program: '6a4963f49e941f93f91f5ac5' }).populate('user');
  console.log('\n--- NAVRATRI REGISTRATIONS (' + registrations.length + ') ---');
  registrations.forEach((r, idx) => {
    console.log(`${idx + 1}. Name: ${r.name}, Email: ${r.email}, Phone: ${r.phone}, PaymentStatus: ${r.paymentStatus}, Method/Tx: ${r.transactionId}, Date: ${r.createdAt}`);
  });

  process.exit(0);
}

checkNavratri().catch(e => { console.error(e); process.exit(1); });
