const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

const crystalProducts = [
  {
    name: "Ascension Health & Vitality Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/health_crystal_bracelet.png"],
    description: `Tagline: Rejuvenate • Vitalize • Restore

Turn your everyday journey into a restorative flow of physical renewal, cellular harmony, and grounded vitality with the Ascension Health & Vitality Crystal Bracelet.

• Sacred Gemstone Composition:
Handcrafted with authentic, high-grade Green Aventurine (the Premier Stone of Opportunity & Physical Well-being) interlaced with master amplifier Clear Quartz (8mm polished crystal beads).

• Energetic & Chakra Alignment:
- Primary Chakra: Heart Chakra (Anahata) & Crown Chakra (Sahasrara)
- Elemental Harmony: Earth & Light
- Astrological Synergy: Virgo, Taurus, Cancer, Gemini, Pisces

• How It Helps You:
- Infuses the physical body and auric field with revitalizing life-force (Prana) energy
- Calms nervous exhaustion, emotional stress, and cardiovascular tension
- Amplifies cellular restoration, immune vitality, and emotional endurance
- Balances the Heart Chakra, nurturing deep self-healing and holistic equilibrium
- Enhances energetic flow during yoga, pranayama, and healing meditations

• Sacred Ritual & Energization:
Each bracelet is cleansed with sacred Himalayan sage and infused with high-frequency Tibetan singing bowls and reiki healing blessings by Sonali Bhasin.

• Sacred Affirmation:
"Every cell in my body vibrates with vitality, strength, and vibrant health. I am restored, balanced, and energized."

Simple. Natural. Powerful.
Ascend to Wellness with Ascension Healing Products`
  },
  {
    name: "Ascension Protection & Grounding Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/protection_crystal_bracelet.png"],
    description: `Tagline: Shield • Ground • Empower

Create an impenetrable auric shield of safety, energetic deflection, and fearless grounding with the Ascension Protection & Grounding Shield Bracelet.

• Sacred Gemstone Composition:
Crafted with genuine Golden Tiger Eye and deep protective Black Tourmaline / Obsidian crystal beads (8mm polished stones).

• Energetic & Chakra Alignment:
- Primary Chakra: Root Chakra (Muladhara) & Solar Plexus (Manipura)
- Elemental Harmony: Earth & Fire
- Astrological Synergy: Scorpio, Capricorn, Aries, Leo, Sagittarius, Cancer

• How It Helps You:
- Acts as a spiritual bodyguard against negative energies, psychic drain, envy, and the evil eye (Nazar)
- Transmutes low or stagnant vibrations into grounded, constructive personal power
- Strengthens root stability and solar plexus confidence for unshakeable courage
- Protects your personal energy field during travel, stressful meetings, and crowded places
- Dissolves anxiety, fear, and environmental electromagnetic static

• Sacred Ritual & Energization:
Blessed and energized during auspicious lunar cycles with protective Sanskrit mantras and sound resonance.

• Sacred Affirmation:
"I am fiercely protected, deeply grounded, and secure in my sacred power. Only love and light can enter my space."

Simple. Natural. Powerful.
Ascend to Wellness with Ascension Healing Products`
  },
  {
    name: "Ascension Love & Peace Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/love_peace_crystal_bracelet.png"],
    description: `Tagline: Love • Heal • Harmonise

Envelope your spirit in the soft, unconditional frequency of pure compassion, emotional healing, and gentle serenity with the Ascension Love & Inner Peace Harmonizer Bracelet.

• Sacred Gemstone Composition:
Features premium Madagascar Rose Quartz (the Stone of Unconditional Love) paired with light-amplifying Clear Quartz crystal beads (8mm polished stones).

• Energetic & Chakra Alignment:
- Primary Chakra: Heart Chakra (Anahata) & Higher Heart Chakra
- Elemental Harmony: Water & Cosmic Light
- Astrological Synergy: Taurus, Libra, Cancer, Pisces, Aquarius, Sagittarius

• How It Helps You:
- Awakens unconditional self-love, deep self-worth, and emotional forgiveness
- Dissolves past emotional baggage, relationship grief, and heart-centered blockages
- Attracts harmonious romantic partnerships, soul connections, and authentic friendships
- Calms emotional turbulence, easing anxiety and bringing tranquil mental peace
- Restores heart-centered balance, gentleness, and empathy in daily communication

• Sacred Ritual & Energization:
Infused with 528Hz love frequency sound baths and blessed with sacred heart-opening intentions by Sonali Bhasin.

• Sacred Affirmation:
"My heart is open to giving and receiving pure, unconditional love. I radiate peace, harmony, and grace."

Simple. Natural. Powerful.
Ascend to Wellness with Ascension Healing Products`
  },
  {
    name: "Ascension Abundance & Wealth Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/abundance_crystal_bracelet.png"],
    description: `Tagline: Attract • Prosper • Expand

Step into the radiant golden stream of unlimited prosperity, career breakthroughs, and magnetic success with the Ascension Abundance & Wealth Manifestation Bracelet.

• Sacred Gemstone Composition:
Handcrafted with natural Golden Citrine (the Merchant's Stone of Prosperity) and brilliant faceted Pyrite beads (8mm polished crystal stones).

• Energetic & Chakra Alignment:
- Primary Chakra: Solar Plexus (Manipura) & Sacral Chakra (Svadhishthana)
- Elemental Harmony: Sun / Fire & Earth
- Astrological Synergy: Leo, Gemini, Aries, Sagittarius, Virgo, Capricorn

• How It Helps You:
- Magnifies prosperity consciousness and accelerates financial and career manifestation
- Clears subconscious scarcity programming and fear around money and success
- Activates the Solar Plexus chakra for unyielding drive, motivation, and leadership
- Attracts lucrative business opportunities, client growth, and career promotions
- Shields financial wealth from envy while amplifying return on creative endeavors

• Sacred Ritual & Energization:
Consecrated during auspicious solar hours with Lakshmi abundance mantras and golden light frequency energization.

• Sacred Affirmation:
"I am a powerful magnet for wealth, success, and divine opportunities. Abundance flows to me easily and endlessly."

Simple. Natural. Powerful.
Ascend to Wellness with Ascension Healing Products`
  },
  {
    name: "Ascension Cleansing & Higher Vibes Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/cleansing_crystal_bracelet.png"],
    description: `Tagline: Purify • Elevate • Transcend

Elevate your vibrational frequency to divine crystal clarity and crystalline peace with the Ascension Cleansing & Higher Vibes Crystal Bracelet.

• Sacred Gemstone Composition:
Made with pure luminous White Selenite (Liquid Light) and high-vibration Prismatic Clear Quartz crystal beads (8mm polished stones).

• Energetic & Chakra Alignment:
- Primary Chakra: Crown Chakra (Sahasrara), Soul Star Chakra & Auric Field
- Elemental Harmony: Cosmic Light & Ether
- Astrological Synergy: Aquarius, Pisces, Gemini, Libra, Scorpio, Taurus

• How It Helps You:
- Sweeps away negative auric attachments, static energy, and mental exhaustion
- Continuously purifies and self-cleanses your entire 7-chakra energetic system
- Sharpens intuition, psychic receptivity, and connection to higher consciousness
- Induces deep serenity and tranquil clarity during meditation, prayer, and sleep
- Protects against psychic clutter and elevates your daily vibrational state

• Sacred Ritual & Energization:
Charged under sacred moonlight and cleansed with ceremonial selenite wands and holy vibrations.

• Sacred Affirmation:
"My mind is clear, my aura is radiant, and my vibration is high. I am aligned with divine light and infinite clarity."

Simple. Natural. Powerful.
Ascend to Wellness with Ascension Healing Products`
  }
];

async function addCrystalBracelets() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (uri) {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB.');

      for (const prod of crystalProducts) {
        const existing = await Product.findOne({ name: prod.name });
        if (existing) {
          await Product.updateOne({ _id: existing._id }, { $set: prod });
          console.log(`Updated product in DB: ${prod.name}`);
        } else {
          await Product.create(prod);
          console.log(`Created product in DB: ${prod.name}`);
        }
      }
    } else {
      console.log('MONGO_URI not defined, updating extracted_products.json only.');
    }

    // Update extracted_products.json to keep in sync
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      for (const prod of crystalProducts) {
        const idx = currentList.findIndex(p => p.name === prod.name);
        if (idx !== -1) {
          currentList[idx] = prod;
        } else {
          currentList.push(prod);
        }
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log(`Successfully updated extracted_products.json with ${crystalProducts.length} crystal bracelets.`);
    }

    console.log('All 5 crystal bracelets uploaded and synchronized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error adding crystal bracelets:', err);
    process.exit(1);
  }
}

addCrystalBracelets();
