const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function check() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  console.log('Connecting to URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'NONE');
  await mongoose.connect(uri);
  
  const Program = require('../models/Program');
  const ProgramRegistration = require('../models/ProgramRegistration');
  const Webinar = require('../models/Webinar');
  const WebinarRegistration = require('../models/WebinarRegistration');
  const Workshop = require('../models/Workshop');
  const WorkshopRegistration = require('../models/WorkshopRegistration');
  const Order = require('../models/Order');
  const User = require('../models/User');

  console.log('\n================== PROGRAMS ==================');
  const programs = await Program.find({});
  for (const p of programs) {
    const regCount = await ProgramRegistration.countDocuments({ program: p._id });
    console.log(`- ID: ${p._id} | Title: "${p.title}" | SellingPrice: ${p.sellingPrice || p.pricing} | RegCount: ${regCount}`);
  }

  console.log('\n================== PROGRAM REGISTRATIONS ==================');
  const progRegs = await ProgramRegistration.find({}).populate('program').populate('user').sort({ createdAt: -1 });
  console.log(`Total Program Registrations in DB: ${progRegs.length}`);
  progRegs.forEach((r, idx) => {
    const progTitle = r.program ? r.program.title : r.program;
    const userName = r.user ? (r.user.name + ' <' + r.user.email + '>') : 'Unknown User';
    console.log(`${idx + 1}. RegID: ${r._id} | Program: ${progTitle} | User: ${userName} | Status: ${r.status} | Payment: ${r.paymentStatus} | Date: ${r.createdAt}`);
  });

  console.log('\n================== WEBINARS ==================');
  const webinars = await Webinar.find({});
  for (const w of webinars) {
    const regCount = await WebinarRegistration.countDocuments({ webinar: w._id });
    console.log(`- ID: ${w._id} | Title: "${w.title}" | Price: ${w.price} | RegCount: ${regCount}`);
  }

  console.log('\n================== WEBINAR REGISTRATIONS (LATEST 15) ==================');
  const webRegs = await WebinarRegistration.find({}).populate('webinar').sort({ createdAt: -1 }).limit(15);
  console.log(`Total Webinar Registrations shown: ${webRegs.length}`);
  webRegs.forEach((r, idx) => {
    const webTitle = r.webinar ? r.webinar.title : r.webinar;
    console.log(`${idx + 1}. ${r.fullName} | ${r.email} | ${r.phone} | Webinar: ${webTitle} | Paid: ${r.paymentStatus} (Rs. ${r.amountPaid}) | Date: ${r.createdAt}`);
  });

  console.log('\n================== WORKSHOPS ==================');
  const workshops = await Workshop.find({});
  for (const ws of workshops) {
    const regCount = await WorkshopRegistration.countDocuments({ workshop: ws._id });
    console.log(`- ID: ${ws._id} | Title: "${ws.title}" | RegCount: ${regCount}`);
  }

  console.log('\n================== ORDERS (LATEST 10) ==================');
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
  console.log(`Total Orders in DB: ${await Order.countDocuments({})}`);
  orders.forEach((o, idx) => {
    console.log(`${idx + 1}. OrderID: ${o._id} | Customer: ${o.shippingAddress?.fullName || o.user} | Total: ${o.totalAmount} | Status: ${o.orderStatus} | Payment: ${o.paymentStatus} | Date: ${o.createdAt}`);
  });

  process.exit(0);
}

check().catch(err => {
  console.error('Error running check:', err);
  process.exit(1);
});
