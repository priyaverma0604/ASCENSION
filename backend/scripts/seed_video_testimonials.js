const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Testimonial = require('../models/Testimonial');

const videoTestimonialsData = [
  {
    name: "Client Healing Journey",
    email: "",
    image: "",
    rating: 5,
    reviewText: "A heartfelt client video testimonial reflecting on sacred angelic guidance, emotional release, and spiritual healing with Sonali Bhasin Kumar.",
    isFeatured: true,
    designation: "Sacred Spiritual Transformation",
    videoUrl: "https://www.instagram.com/tv/CV68_YQBQS4/?xtok=c2IydGFnMnlxcWZt",
    videoType: "instagram",
    isVideo: true
  },
  {
    name: "Sacred Awakening Experience",
    email: "",
    image: "",
    rating: 5,
    reviewText: "A transformative client video reflection on divine alignment, emotional peace, and miraculous inner healing through Ascension.",
    isFeatured: true,
    designation: "Client Transformation & Energy Healing",
    videoUrl: "https://www.instagram.com/reel/CZOJrvNLXlN/?cplk=bnA3d2JidjJreGN6",
    videoType: "instagram",
    isVideo: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    for (const item of videoTestimonialsData) {
      const existing = await Testimonial.findOne({
        $or: [
          { videoUrl: item.videoUrl },
          { name: item.name }
        ]
      });

      if (existing) {
        existing.videoUrl = item.videoUrl;
        existing.videoType = item.videoType;
        existing.isVideo = true;
        existing.isFeatured = true;
        existing.rating = item.rating;
        existing.designation = item.designation;
        existing.reviewText = item.reviewText;
        await existing.save();
        console.log(`Updated testimonial: ${item.name} (${existing._id})`);
      } else {
        const created = await Testimonial.create(item);
        console.log(`Created testimonial: ${item.name} (${created._id})`);
      }
    }

    const all = await Testimonial.find({});
    console.log(`Total testimonials in DB now: ${all.length}`);
  } catch (err) {
    console.error('Error seeding video testimonials:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

seed();
