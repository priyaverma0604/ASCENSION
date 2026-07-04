const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Workshop = require('../models/Workshop');
const Retreat = require('../models/Retreat');
const CommunityPost = require('../models/CommunityPost');
const Testimonial = require('../models/Testimonial');
const Program = require('../models/Program');

dotenv.config();

const servicesData = [
  {
    title: "Distance Healing using Theta Modality",
    description: "Theta Healing is a powerful energy healing technique that works at the subconscious level to identify and release limiting beliefs, fears, emotional trauma, and energetic blockages. Many individuals unknowingly carry deep-rooted emotional wounds from childhood, relationships, or past experiences. Theta Healing helps you release limiting beliefs, fears, emotional trauma, and energetic blockages at the subconscious level, transforming your reality and raising your vibration.",
    benefits: [
      "Identify and reprogram subconscious blockages",
      "Release deep-rooted fears, anxiety, and trauma",
      "Heal childhood wounds and relationship baggages",
      "Align mind, body, and soul with abundance and health"
    ],
    duration: 60,
    pricing: 3500,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Oracle Card Reading Session",
    description: "Sometimes the soul seeks direction and insight. Our Oracle Card Reading sessions provide intuitive guidance for career, relationships, financial decisions, and personal growth. Every reading is conducted with intuition, compassion, and positive energy, helping you make informed choices and align with your higher purpose. Get clarity, advice, and spiritual insight into your current situations.",
    benefits: [
      "Gain direct clarity on relationship and career roadblocks",
      "Receive supportive guidance from divine spiritual energies",
      "Re-align with your higher self and path forward",
      "Heal indecisiveness and find peace in current actions"
    ],
    duration: 45,
    pricing: 2100,
    image: "https://images.unsplash.com/photo-1572945281781-863a3014a51e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Personal Counselling Session",
    description: "Create a safe, confidential, and nurturing space to discuss emotional pain, anxiety, stress, or career roadblocks. Sonali Bhasin Kumar combines active empathy, transpersonal psychology, and energy understanding to guide you to find actionable paths forward, release tension, and restore personal confidence.",
    benefits: [
      "Receive compassionate, non-judgmental professional counsel",
      "Explore stress and anxiety triggers in a supportive space",
      "Generate actionable frameworks for resolving life conflicts",
      "Restore self-love, boundaries, and personal empowerment"
    ],
    duration: 60,
    pricing: 3000,
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Chakra Healing",
    description: "Align and balance the seven major energy centers in your body. Purge stagnant, heavy, and negative energies from your auric field and restore the natural flow of prana/vitality. This session leaves you feeling completely grounded, centered, and physically re-energized.",
    benefits: [
      "Purify and rebalance the seven major chakra centers",
      "Harmonize emotional swings and remove energetic lethargy",
      "Strengthen your aura against negative ambient energies",
      "Increase physical vitality and mental clear-sightedness"
    ],
    duration: 60,
    pricing: 2800,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sound Healing",
    description: "Sound Healing is a therapeutic modality that uses frequencies, vibrations, and instruments like Tibetan singing bowls to restore energetic balance and emotional harmony. Frequencies bypass logical blocks to touch the cellular level, restoring balance and deep relaxation to your nervous system.",
    benefits: [
      "Induce profound meditative states and deep relaxation",
      "Relieve physical tension and alleviate chronic insomnia",
      "Calm active mental chatter and reset cortisol levels",
      "Restore cell-level resonance using harmonic bowls"
    ],
    duration: 60,
    pricing: 2500,
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
  }
];

const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'extracted_products.json'), 'utf-8')
);

const workshopsData = [
  {
    title: "Manifestation Masterclass: Co-Creating Abundance",
    description: "Your thoughts, beliefs, and energy shape your reality. Our Manifestation Masterclass teaches you how to align your energy with your intentions through practical spiritual techniques. Participants learn affirmations, visualization, abundance mapping, and release scripts to clear doubts. This is more than a workshop; it is an energetic transformation experience that empowers you to co-create the life you desire.",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    time: "4:00 PM - 6:30 PM IST",
    pricing: 1500,
    capacity: 50
  },
  {
    title: "Angel Alignment Workshop: Accessing Divine Guidance",
    description: "The universe constantly sends signs, messages, and guidance. In our Angel Workshops, participants learn to connect with angelic energy, clear emotional blockages, interpret universal synchronicities, and strengthen intuitive pathways in a safe, nurturing environment. Ideal for spiritual seekers looking for divine support and clarity.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    time: "3:00 PM - 5:30 PM IST",
    pricing: 2100,
    capacity: 35
  }
];

const retreatsData = [
  {
    title: "5-Day Rishikesh Spiritual Reconnection Retreat",
    description: "Join Sonali Bhasin Kumar in holy Rishikesh for a 5-day spiritual immersion. Nestled along the banks of the sacred Ganges, this retreat is designed to reset your energy, purge emotional loads, and align your soul with your highest purpose. Experience yoga, Ganga Aarti, deep Theta meditations, fire rituals, and therapeutic sound baths.",
    pricing: 24999,
    capacity: 15,
    images: ["https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"],
    itinerary: [
      { day: 1, title: "Sacred Welcome & Intention Setting", description: "Arrive at our riverside resort. Join the opening circle, get personal energy assessments, and set intentions around our introductory circle." },
      { day: 2, title: "Subconscious Clearing & Holy Dip", description: "Sunrise mindfulness meditation, intensive group Theta Healing to clear ancestral blocks, and a holy dip in the clean Ganges waters." },
      { day: 3, title: "Sound Healing & Ganga Aarti", description: "A therapeutic 2-hour Tibetan Singing Bowl sound bath. In the evening, attend the beautiful Parmarth Niketan Aarti." },
      { day: 4, title: "Angel Manifestation & Sacred Fire Ritual", description: "Connecting with guides workshop, abundance mapping, and a sunset Havah/Yajna ritual around the sacred fire." },
      { day: 5, title: "Closing Integration & Blessings", description: "Final integration coaching session, blessing ceremony, Prasad distribution, and departure." }
    ]
  }
];

const testimonialsData = [
  {
    name: "Meera Nair",
    rating: 5,
    reviewText: "The Theta Healing session with Sonali was eye-opening. I released childhood blocks that I didn't even realize I had. My anxiety levels have dropped significantly.",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Rohan Sharma",
    rating: 5,
    reviewText: "Her Manifestation Workshop is practical and energetic. Within two weeks of applying the abundance mapping, I manifested a career role that matches my goals perfectly!",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Kriti Sen",
    rating: 5,
    reviewText: "The Sound Healing bath was magic. I fell into the deepest rest I've had in years. Highly recommend her services to anyone seeking peace in chaotic New Delhi.",
    isFeatured: true,
  }
];

const programsData = [
  {
    title: "Ancestral Healing Workshop",
    description: "Ancestral Healing, or healing our intergenerational trauma is the belief that we are not merely the blood and bones of parents and our cultures, but that we carry our memories, traumas, pain as well gifts from our ancestors through Family Karma. Popular Culture tells us that we’re independent beings, set free in all ways, but in reality, we all face challenges in our lives as a consequence of Ancestral Blocks and Family Karma. It is, however, possible to get into a process to bring cleaning, healing, and empowerment through repair work with our ancestral lineages. In Ascension's most ambitious program thus far, Join Sonali in not only connecting you to your ancestors but in clearing Pitrudosh and other Ancestral Blocks to bring peace in your lives and for your ancestors.",
    duration: "3 Sessions",
    pricing: 4500,
    enrollmentCapacity: 30,
    images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/jIs3IH-brtg"
  },
  {
    title: "Guided Meditations",
    description: "Meditations are a channel for one to go within and better their relationships with their own mental, spiritual, and physical bodies. At Ascension, Sonali makes her meditations enable introspective work to access greater consciousness by releasing negative beliefs and in turn, integrating holistic beliefs into one fold. Through meditations on balancing Chakric Fields, Prosperity Consciousness, Integration the power of Peace in Relationships, Karmic Dispensation and Ancestral Healing, she has produced a stock of guided meditations that push everyone to their Ascension.",
    duration: "1 Session",
    pricing: 2100,
    enrollmentCapacity: 50,
    images: ["https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/MERkgMlwkJs"
  },
  {
    title: "Angel Therapy workshops",
    description: "Our Planet is governed by a host of Angels, Spirit Guides, and other Ascended Beings who help us transmute the negativity, dispense negative karma and, operate from unconditional love and light. One such set of Angels are the Archangels, whose existence can be traced to Abrahamic religions particularly in Central Asia and Western Europe. Interestingly, both The Bible and The Quran talk about these angels. Through simple rituals like hosting angels, creating altars to honor them and, meditations to invoke them to beautify one's lives, Ascension consistently strives to spread their message of Tranquility and Unity across the Globe.",
    duration: "1 Session",
    pricing: 2500,
    enrollmentCapacity: 25,
    images: ["https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/rrcE3NIe66Q"
  },
  {
    title: "21 days affirmations program",
    description: "Affirmations are positive phrases or mantras that we repeat to ourselves, which describe a specific outcome or who we want to be. At first, these affirmations might appear untrue, but with constant repetition, our subconscious mind will start to believe them and eventually these affirmations become powerful tools for manifesting dreams. Through her vast pool of knowledge, Sonali has produced immaculate results through these Affirmations in only 21 days!",
    duration: "21 Days",
    pricing: 3500,
    enrollmentCapacity: 100,
    images: ["https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/yA7uD1DXeaU"
  },
  {
    title: "30 days gratitude program",
    description: "Gratitude is a high vibrational action, which means giving thanks from your heart. When you do this, energy flows from your heart and activates certain responses from other people as well as the Universe. Through the 21-day Gratitude Programme, Ascension works towards drawing your attention to the multiple blessings you have in your life and enables you to cope with limiting beliefs by giving you the tools to be able to take on every challenge to the best of your ability.",
    duration: "30 Days",
    pricing: 4200,
    enrollmentCapacity: 80,
    images: ["https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/w3m7qjInPpY"
  },
  {
    title: "21 days mirror work for self love program",
    description: "A Prayer is a tool to communicate with God. Whether we realize it or not, God is on the other end of the phone line, listening to us all the time. Every word and every thought we send along is a prayer, which helps transmute negative Karmic Cycles. Through guided and curated prayers, Sonali takes us one step closer to God through the power of Ascension by our side, with prayers for ourselves, our friends, families, and Mother Earth.",
    duration: "21 Days",
    pricing: 3500,
    enrollmentCapacity: 100,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/prtjHYiifEQ"
  },
  {
    title: "21 days prayers",
    description: "A Prayer is a tool to communicate with God. Whether we realize it or not, God is on the other end of the phone line, listening to us all the time. Every word and every thought we send along is a prayer, which helps transmute negative Karmic Cycles. Through guided and curated prayers, Sonali takes us one step closer to God through the power of Ascension by our side, with prayers for ourselves, our friends, families, and Mother Earth.",
    duration: "21 Days",
    pricing: 3500,
    enrollmentCapacity: 100,
    images: ["https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: "https://www.youtube.com/embed/SK_mLIaVfao"
  },
  {
    title: "21 days release work program",
    description: "As the term itself explains, through exercises and meditations, we release what isn't serving us and we release all past traumas and pains which are deeply embedded into our being and causing harm, by increasing our consciousness and inculcating positivity into our fold.",
    duration: "21 Days",
    pricing: 3500,
    enrollmentCapacity: 100,
    images: ["https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: ""
  },
  {
    title: "21 days forgiveness program",
    description: "Forgiveness, much like Gratitude is one of the most empowering tools, that can help individuals emancipate themselves from the shackles of the aggressor's wrath, regain control of their life's narrative and initiate the process of moving on to recovering the power they lost. In Ascension's upcoming venture, join Sonali in healing the wounds of the past, forgiving your inner demons and the actions of those who have hurt you.",
    duration: "21 Days",
    pricing: 3500,
    enrollmentCapacity: 100,
    images: ["https://images.unsplash.com/photo-1522881197257-40fcd4855a76?auto=format&fit=crop&w=800&q=80"],
    youtubeUrl: ""
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Seed: Connected to Database...');

    // Clear existing collections
    await User.deleteMany();
    await Service.deleteMany();
    await Product.deleteMany();
    await Workshop.deleteMany();
    await Retreat.deleteMany();
    await CommunityPost.deleteMany();
    await Testimonial.deleteMany();
    await Program.deleteMany();
    console.log('Seed: Cleared old collections (including Programs)...');

    // Create Admin User
    const adminUser = await User.create({
      name: "Sonali Bhasin Kumar",
      email: "ascension.sonalibhasin@gmail.com",
      password: "admin123", // Hashes automatically via User Schema pre-save hook
      role: "admin"
    });
    console.log(`Seed: Created Admin Account -> ${adminUser.email} / admin123`);

    // Create Services
    const services = await Service.create(servicesData);
    console.log(`Seed: Created ${services.length} wellness services.`);

    // Create Products
    const products = await Product.create(productsData);
    console.log(`Seed: Created ${products.length} crystals/shop items.`);

    // Create Workshops
    const workshops = await Workshop.create(workshopsData);
    console.log(`Seed: Created ${workshops.length} upcoming workshops.`);

    // Create Retreats
    const retreats = await Retreat.create(retreatsData);
    console.log(`Seed: Created ${retreats.length} retreats.`);

    // Create Testimonials
    const testimonials = await Testimonial.create(testimonialsData);
    console.log(`Seed: Created ${testimonials.length} testimonials.`);

    // Create Programs
    const programs = await Program.create(programsData);
    console.log(`Seed: Created ${programs.length} programs.`);

    // Create a default Community Post
    const post = await CommunityPost.create({
      author: adminUser._id,
      title: "Welcome to the Ascension Community Platform",
      content: "We are thrilled to open our virtual doors to you. Here, we will post spiritual insights, volunteer opportunities for Ascension Seva NGO, and upcoming retreats. Feel free to join our WhatsApp Community and stay aligned with our higher frequencies.",
      type: "announcement",
      date: new Date(),
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
    });
    console.log(`Seed: Created default community post.`);

    console.log('Database Seeding Completed Successfully! Exiting...');
    mongoose.connection.close();
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
