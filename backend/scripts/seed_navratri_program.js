const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Program = require('../models/Program');
const Assignment = require('../models/Assignment');

const NAVRATRI_PROGRAM_ID = '6a4963f49e941f93f91f5ac5';

const navratriProgramData = {
  _id: new mongoose.Types.ObjectId(NAVRATRI_PROGRAM_ID),
  title: "9-Day Sacred Navratri Audio Transformation",
  description: "Embark on an auspicious 9-day spiritual healing journey honoring the 9 divine manifestations of Maa Durga (Navadurga). Each day unlocks a dedicated, high-vibrational spiritual audiobook and guided energetic transmission. Listen to each day's sacred audio sequentially to unlock subsequent days. Access remains valid for 10 days from your enrollment date.",
  duration: "9 Days",
  startDate: "Navratri Special",
  pricing: 999,
  originalPrice: 1999,
  sellingPrice: 999,
  enrollmentCapacity: 500,
  images: ["/uploads/navratri_9_days_banner.jpg"],
  youtubeUrl: "",
  requiresAssignmentApproval: false
};

async function seedNavratri() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set in environment.');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    // 1. Upsert Navratri Program
    let program = await Program.findById(NAVRATRI_PROGRAM_ID);
    if (program) {
      Object.assign(program, navratriProgramData);
      await program.save();
      console.log('Updated existing Navratri Program:', program._id);
    } else {
      program = await Program.create(navratriProgramData);
      console.log('Created new Navratri Program:', program._id);
    }

    // 2. Read navratriAssignments data
    const filePath = path.join(__dirname, '../../frontend/src/data/navratriAssignments.js');
    let fileContent = fs.readFileSync(filePath, 'utf8');
    fileContent = fileContent.replace('export default navratriAssignments;', 'module.exports = navratriAssignments;');
    
    const tempFile = path.join(__dirname, 'temp-navratri.js');
    fs.writeFileSync(tempFile, fileContent);
    const navratriAssignments = require(tempFile);

    // 3. Clear existing assignments for this program
    await Assignment.deleteMany({ program: program._id });
    console.log('Cleared existing assignments for Navratri Program.');

    // 4. Insert 9 Daily Audio Assignments
    const docs = navratriAssignments.map(item => {
      const content = `Goddess: ${item.goddess}\nChakra Center: ${item.chakra}\nSacred Color: ${item.color}\nDivine Mantra: ${item.mantra}\n\nAudio Theme: ${item.audioTheme}\n\n${item.description}\n\nPractice & Reflection:\n${item.action}`;
      return {
        program: program._id,
        dayNumber: item.day,
        title: item.title,
        content: content,
        estimatedDuration: item.duration,
        audioUrl: item.audioUrl,
        audioDuration: item.duration,
        image: '',
        status: 'Active'
      };
    });

    await Assignment.insertMany(docs);
    console.log(`Successfully seeded ${docs.length} Navratri Audio Book assignments!`);

    // Clean up temporary file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    console.log('=== NAVRATRI PROGRAM SEED COMPLETED ===');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error seeding Navratri Program:', error);
    process.exit(1);
  }
}

seedNavratri();
