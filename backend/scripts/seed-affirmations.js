const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Assignment = require('../models/Assignment');
const Program = require('../models/Program');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database...');

    const programId = '6a4963f49e941f93f91f5abe';
    const program = await Program.findById(programId);
    if (!program) {
      console.error('21 Days Affirmations Program not found in database!');
      process.exit(1);
    }

    // Read affirmationAssignments.js file content
    const filePath = path.join(__dirname, '../../frontend/src/data/affirmationAssignments.js');
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Convert ES module export to CommonJS
    fileContent = fileContent.replace('export default affirmationAssignments;', 'module.exports = affirmationAssignments;');
    
    // Write temporary file
    const tempFile = path.join(__dirname, 'temp-affirmations.js');
    fs.writeFileSync(tempFile, fileContent);

    // Require the converted array
    const affirmationAssignments = require(tempFile);

    // Clear existing assignments for this program
    await Assignment.deleteMany({ program: programId });
    console.log('Cleared old affirmation assignments.');

    // Seed new assignments
    const docs = affirmationAssignments.map(item => {
      const content = `${item.description}\n\nTask:\n${item.action}`;
      return {
        program: programId,
        dayNumber: item.day,
        title: item.title,
        content: content,
        estimatedDuration: '30 minutes',
        image: '',
        status: 'Active'
      };
    });

    await Assignment.insertMany(docs);
    console.log(`Successfully seeded ${docs.length} affirmation assignments!`);

    // Clean up temporary file
    fs.unlinkSync(tempFile);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
