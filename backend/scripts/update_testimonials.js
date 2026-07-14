const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Testimonial = require('../models/Testimonial');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testimonialsData = [
  {
    name: "Megha Chadha",
    rating: 5,
    reviewText: "Ascension – the name sums it up. If you want to become a better version of yourself and ascend spiritually, this is the best platform for you. Sonali was a god sent for me. My journey started during the first few weeks of the lockdown when Sonali launched her first ‘spiritual laws’ session. Her way of explaining the laws, the structure she followed and the discussions that went on were so amazing. I even ended up taking notes and filling an entire book!! I went on to do her 21 days affirmations, monthly full moon meditations, weekly meditations, angels workshops, 21 days gratitude, and now looking forward to the ancestral healing workshop. It's been a great learning. I feel I have become more aware of my reactions and more calm in situations. She really taught me to believe in the universe and think from my higher self. If I've become a calmer person it's only thanks to Sonali. She is always there to talk and give advice. She is truly gifted and a wonderful person. So glad I found her this lifetime.",
    isFeatured: true,
    image: "/uploads/megha_chadha.png",
    designation: ""
  },
  {
    name: "Amit Bhasin",
    rating: 5,
    reviewText: "Theta, Access Consciousness were already in our life when Sonali included us in her energy circle of Ascension. They say ‘When the student is ready, the teacher appears’. Little did we know that my young elfin sister Sonali would soar so high into the sky and root herself so deep beneath, that she could spread light all around her. Sonali's positive snippets are often what one wants to read, whether on whatsapp or on Instagram. She touches a chord, which remain hidden. She inspires one to trust the Universe and its limitless fountain of energy and to drink from it. My journey into meditation began with Sonali and continues with Ascension. Its an exciting journey I can see and I am looking forward to it.",
    isFeatured: true,
    image: "/uploads/amit_bhasin.png",
    designation: "ADVOCATE"
  },
  {
    name: "Shuchi Bhasin",
    rating: 5,
    reviewText: "COVID-19 brought with it fear,depression, anxiety, panic, worry, loneliness and uncertainty. All these negative emotions were playing havoc with my Parkinson's too.I was miserable mentally and emotionally. I started getting panic attacks and my anxiety levels were going off the roof. Sonali's invite for Spiritual laws sessions changed everything. She was God send and a miracle that happened to me. I'm a different person now ,on the spiritual path trying to evolve. All thanks to Sonali. I'm forever in gratitude. She is so eloquent, passionate, thought provoking, honest, relentless, sensitive and knowledgeable. I have learnt so much from her and my whole perspective towards life has changed and I'm ascending. I owe a lot to her. May she ascend to the top and be a spiritual guide and a master,awakening the divine in all.May she spread love n light to us mortal beings so that our journey towards the ultimate divine becomes easier.",
    isFeatured: true,
    image: "/uploads/shuchi_bhasin.png",
    designation: ""
  }
];

const updateTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear old testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared old testimonials.');

    // Insert new testimonials
    const docs = await Testimonial.insertMany(testimonialsData);
    console.log(`Inserted ${docs.length} new testimonials:`, docs);

    process.exit(0);
  } catch (err) {
    console.error('Error updating testimonials:', err);
    process.exit(1);
  }
};

updateTestimonials();
