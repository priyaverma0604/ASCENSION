const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Service = require('../models/Service');
const Retreat = require('../models/Retreat');

async function updatePrices() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // 1. Theta Healing
    await Service.updateOne(
      { title: /theta/i },
      {
        $set: {
          pricing: 3555,
          duration: 30,
          description: "Theta Healing is a powerful energy healing technique that works at the subconscious level to identify and release limiting beliefs, fears, emotional trauma, and energetic blockages. *Pricing starts from ₹3555 onwards (additional charges will vary from case to case based on depth of energetic work required)."
        }
      }
    );
    console.log('Updated Theta Healing price -> ₹3555 onwards');

    // 2. Sound Healing
    await Service.updateOne(
      { title: /sound/i },
      {
        $set: {
          pricing: 2999,
          duration: 30
        }
      }
    );
    console.log('Updated Sound Healing price -> ₹2999');

    // 3. Chakra Healing
    await Service.updateOne(
      { title: /chakra/i },
      {
        $set: {
          pricing: 2888,
          duration: 30
        }
      }
    );
    console.log('Updated Chakra Healing price -> ₹2888');

    // 4. Personal Counselling / Personal Healing Session
    await Service.updateOne(
      { $or: [{ title: /counsell/i }, { title: /personal/i }] },
      {
        $set: {
          title: "Personal Healing & Counselling Session",
          pricing: 3333,
          duration: 30
        }
      }
    );
    console.log('Updated Personal Healing & Counselling Session price -> ₹3333');

    // 5. Retreats collection - remove or update Rishikesh retreat
    await Retreat.deleteMany({});
    console.log('Cleared old Rishikesh retreat from retreats collection.');

    const services = await Service.find();
    console.log('Current Services:', services.map(s => ({ title: s.title, pricing: s.pricing })));
    process.exit(0);
  } catch (err) {
    console.error('Error updating prices:', err);
    process.exit(1);
  }
}

updatePrices();
