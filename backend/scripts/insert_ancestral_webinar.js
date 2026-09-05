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

const ancestralWebinarData = {
  title: "Ancestral Healing Webinar",
  shortDescription: "Join Sonali Bhasin Kumar for a powerful live introductory Ancestral Healing Webinar. Discover the foundations of healing family karma, clearing intergenerational trauma, and receiving sacred ancestral blessings.",
  detailedDescription: `Ascension Meditations is inviting you to a scheduled Zoom meeting.

Topic: Ancestral Healing Webinar 
Time: Sep 23, 2026 07:00 PM Mumbai, Kolkata, New Delhi

Join Zoom Meeting:
https://us06web.zoom.us/j/84687921254?pwd=JfIw5Yz7mJAGaYORvDkmiL5cWQCIUV.1

Meeting chat link:
https://us06web.zoom.us/launch/jc/84687921254

Meeting ID: 846 8792 1254
Passcode: 001979

---

One tap mobile:
+13126266799,,84687921254#,,,,*001979# US (Chicago)
+13462487799,,84687921254#,,,,*001979# US (Houston)

---

Join by SIP:
• 84687921254@zoomcrc.com

Join instructions:
https://us06web.zoom.us/meetings/84687921254/invitations?signature=8YAk3kxoAsqr6CahX5kMM5gbwGedqMg5B9KIZ8QnfO8`,
  speakerName: "Sonali Bhasin Kumar",
  date: new Date('2026-09-23T19:00:00+05:30'),
  time: "7:00 PM - 8:30 PM IST",
  duration: "90 minutes",
  price: 99,
  coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
  upiQrCodeImage: "/uploads/default_upi_qr.jpg",
  upiId: "sonalibhasinkumar@ptaxis",
  mobileNumber: "9999999999",
  zoomLink: "https://us06web.zoom.us/j/84687921254?pwd=JfIw5Yz7mJAGaYORvDkmiL5cWQCIUV.1",
  meetingId: "846 8792 1254",
  passcode: "001979",
  meetingChatLink: "https://us06web.zoom.us/launch/jc/84687921254",
  oneTapMobile: "+13126266799,,84687921254#,,,,*001979# US (Chicago) / +13462487799,,84687921254#,,,,*001979# US (Houston)",
  joinBySip: "84687921254@zoomcrc.com",
  whatsappGroupLink: "https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16",
  maxSeats: 150,
  status: "Upcoming",
  isWebinar: true
};

async function insertWebinar() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.');

    // Upsert webinar
    const existing = await Webinar.findOne({ title: /Ancestral Healing Webinar/i });
    if (existing) {
      Object.assign(existing, ancestralWebinarData);
      await existing.save();
      console.log('Updated existing Ancestral Healing Webinar:', existing._id);
    } else {
      const created = await Webinar.create(ancestralWebinarData);
      console.log('Created new Ancestral Healing Webinar:', created._id);
    }

    const allWebinars = await Webinar.find({});
    console.log('Total Webinars in DB:', allWebinars.length);
    allWebinars.forEach(w => {
      console.log(`- ${w.title} | ₹${w.price} | Date: ${w.date.toISOString()} | Time: ${w.time}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error inserting Ancestral Healing Webinar:', error);
    process.exit(1);
  }
}

insertWebinar();
