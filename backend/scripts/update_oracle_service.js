const mongoose = require('mongoose');
require('dotenv').config();

const updateOracleService = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const Service = require('../models/Service');
    const oracleService = await Service.findOne({
      title: { $regex: /oracle/i }
    });

    if (oracleService) {
      oracleService.title = "1:1 Oracle Card Reading Session";
      oracleService.description = "Not a COINCIDENCE... Your Soul Brought You Here. Unlock sacred messages meant only for you through personal, intuitive, and transformational 1:1 Oracle Card Readings with Sonali Bhasin Kumar. Using 21+ powerful decks (including The Sacred Creator, The Spirited Animal, Moonology, Wisdom of the Oracle, Sacred Destiny & more), we channel multiple energies for deep clarity, healing, and spiritual guidance across love, career, finances, relationships, and life transitions.";
      oracleService.benefits = [
        "1:1 Personal, Intuitive & Transformational Session with Sonali",
        "21+ Powerful Sacred Decks channeling multiple energies & deep insights",
        "Profound Clarity, Healing & Guidance for Love, Career & Life Path",
        "One-on-One Private Consultation focused completely on your soul growth",
        "Choose custom deck tiers from 3 Decks (₹999) to full 21+ Master Decks (₹2,999)"
      ];
      oracleService.pricing = 999;
      oracleService.duration = 30;
      await oracleService.save();
      console.log('Successfully updated Oracle Card Reading service in database!');
    } else {
      console.log('Oracle service not found, creating new one...');
      await Service.create({
        title: "1:1 Oracle Card Reading Session",
        description: "Not a COINCIDENCE... Your Soul Brought You Here. Unlock sacred messages meant only for you through personal, intuitive, and transformational 1:1 Oracle Card Readings with Sonali Bhasin Kumar. Using 21+ powerful decks (including The Sacred Creator, The Spirited Animal, Moonology, Wisdom of the Oracle, Sacred Destiny & more), we channel multiple energies for deep clarity, healing, and spiritual guidance across love, career, finances, relationships, and life transitions.",
        benefits: [
          "1:1 Personal, Intuitive & Transformational Session with Sonali",
          "21+ Powerful Sacred Decks channeling multiple energies & deep insights",
          "Profound Clarity, Healing & Guidance for Love, Career & Life Path",
          "One-on-One Private Consultation focused completely on your soul growth",
          "Choose custom deck tiers from 3 Decks (₹999) to full 21+ Master Decks (₹2,999)"
        ],
        duration: 30,
        pricing: 999,
        image: "/uploads/oracle_card_reading_service.png"
      });
      console.log('Created Oracle Card Reading service!');
    }

    const allServices = await Service.find({}, 'title duration pricing');
    console.log('Updated services in DB:');
    allServices.forEach(s => console.log(`- ${s.title}: ${s.duration} mins (₹${s.pricing})`));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updateOracleService();
