const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function enrollRakhee() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGO_URI is missing from backend/.env');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB successfully.');

  const User = require('../models/User');
  const Program = require('../models/Program');
  const ProgramRegistration = require('../models/ProgramRegistration');
  const UserProgramProgress = require('../models/UserProgramProgress');

  const email = 'nagpal.rakhee@gmail.com'.toLowerCase().trim();
  const name = 'Rakhee Nagpal';
  const phone = '+44 7957 341169';

  // 1. Find or create user
  let user = await User.findOne({ email });
  if (!user) {
    console.log(`User ${email} does not exist. Creating new account...`);
    const defaultPassword = 'AscensionUser@2025';
    user = await User.create({
      name,
      email,
      phone,
      password: defaultPassword,
      role: 'user'
    });
    console.log(`Created new User account with ID: ${user._id}`);
  } else {
    console.log(`User already exists with ID: ${user._id}, Name: ${user.name}`);
    if (!user.name || user.name !== name) {
      user.name = name;
    }
    await user.save();
  }

  // 2. Find Navratri Program
  let program = await Program.findById('6a4963f49e941f93f91f5ac5');
  if (!program) {
    program = await Program.findOne({ title: { $regex: /navratri/i } });
  }

  if (!program) {
    throw new Error('Navratri program not found in database!');
  }

  console.log(`Navratri Program found: "${program.title}" (ID: ${program._id})`);

  // 3. Add to Program.enrolledUsers
  const alreadyInProgram = program.enrolledUsers.some(
    (uId) => (uId?._id || uId).toString() === user._id.toString()
  );

  if (!alreadyInProgram) {
    program.enrolledUsers.push(user._id);
    program.enrolledCount = program.enrolledUsers.length;
    await program.save();
    console.log(`Added user ${user._id} to Program.enrolledUsers. Total enrolled: ${program.enrolledCount}`);
  } else {
    console.log(`User is already in Program.enrolledUsers.`);
  }

  // 4. Create or update ProgramRegistration
  let registration = await ProgramRegistration.findOne({
    program: program._id,
    $or: [{ user: user._id }, { email }]
  });

  if (!registration) {
    registration = await ProgramRegistration.create({
      program: program._id,
      user: user._id,
      name,
      email,
      phone,
      paymentStatus: 'Paid',
      transactionId: 'ADMIN_DIRECT_ACCESS_' + Date.now(),
      paymentScreenshot: ''
    });
    console.log(`Created Paid ProgramRegistration record (ID: ${registration._id}).`);
  } else {
    registration.user = user._id;
    registration.name = name;
    registration.phone = phone;
    registration.paymentStatus = 'Paid';
    if (!registration.transactionId) {
      registration.transactionId = 'ADMIN_DIRECT_ACCESS_' + Date.now();
    }
    await registration.save();
    console.log(`Updated ProgramRegistration record to Paid status (ID: ${registration._id}).`);
  }

  // 5. Initialize UserProgramProgress if not present
  let progress = await UserProgramProgress.findOne({
    user: user._id,
    program: program._id
  });

  if (!progress) {
    progress = await UserProgramProgress.create({
      user: user._id,
      program: program._id,
      currentDay: 1,
      completed: false,
      submissions: []
    });
    console.log(`Created initial UserProgramProgress (Current Day: 1).`);
  } else {
    console.log(`UserProgramProgress already exists (Current Day: ${progress.currentDay}).`);
  }

  console.log('\n========================================');
  console.log('SUCCESS! Access granted to Rakhee Nagpal:');
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Phone: ${phone}`);
  console.log(`Program: ${program.title}`);
  console.log(`Dashboard URL: https://ascension.ind.in/program/${program._id}/dashboard`);
  console.log('========================================\n');

  process.exit(0);
}

enrollRakhee().catch((err) => {
  console.error('Error granting access:', err);
  process.exit(1);
});
