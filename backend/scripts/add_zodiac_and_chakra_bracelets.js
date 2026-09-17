import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricing: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 50 },
  images: [{ type: String }],
  isCustomizable: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const newProducts = [
  {
    name: "Ascension 7 Chakra Balance Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/seven_chakra_crystal_bracelet.png"],
    description: `Tagline: Balance • Heal • Align • Transform | Positive Mind, Positive Energy, A Brighter Life

Gemstone Composition:
100% Authentic Natural Gemstones featuring:
1. Root Chakra (Muladhara - I AM): Red Carnelian — Provides stability, increases courage, builds confidence.
2. Sacral Chakra (Svadhisthana - I FEEL): Orange Aventurine — Boosts creativity, enhances joy, supports emotional balance.
3. Solar Plexus Chakra (Manipura - I DO): Citrine — Increases self-confidence, brings motivation, attracts success & wealth.
4. Heart Chakra (Anahata - I LOVE): Green Aventurine — Attracts love & prosperity, promotes holistic healing, brings compassion.
5. Throat Chakra (Vishuddha - I SPEAK): Aquamarine — Enhances clear communication, builds self-expression, brings mental clarity.
6. Third Eye Chakra (Ajna - I SEE): Lapis Lazuli — Boosts intuition, enhances inner wisdom, assists in manifestation & psychic insight.
7. Crown Chakra (Sahasrara - I UNDERSTAND): Amethyst — Brings spiritual protection, enhances higher consciousness, promotes serene inner peace.

Spiritual Properties & Energy:
Crafted with high-grade polished natural crystal beads separated by elegant golden accents, the Ascension 7 Chakra Bracelet serves as an energetic tuning fork for your whole subtle body. Wearing it aligns and revitalizes all 7 energy vortexes, clears stagnant energetic blockages, and surrounds you with an uplifting shield of vibrant, balanced prana (life force).

Why Wear:
- Complete alignment and balancing of all 7 chakras
- Dissolves energy blockages and fatigue from daily stress
- Magnifies positive aura vibrations, optimism, and emotional resilience
- Enhances meditation, yoga, mindfulness, and spiritual manifestation
- A stunning daily reminder to stay grounded, open-hearted, and spiritually aligned

Affirmation:
"My chakras are aligned in perfect harmony. I am balanced, healthy, peaceful, and abundant."

How to Care & Charge:
Cleanse regularly with sacred white sage smoke, camphor fumes, or Selenite plate. Avoid prolonged soaking in harsh chemicals or saltwater.`
  },
  {
    name: "Ascension Aries Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/aries_zodiac_crystal_bracelet.png"],
    description: `Tagline: Courage • Passion • New Beginnings | Bolder • Brighter • Stronger You

Zodiac Alignment: Aries (♈) | March 21 – April 19 | Element: Fire | Ruling Planet: Mars

Gemstone Composition & Properties:
Featuring authentic natural gemstone beads with an engraved Golden Aries Astrological Charm:
- Red Carnelian: Boosts unstoppable confidence, increases motivation, and brings courageous drive.
- Sunstone: Attracts golden success, enhances sunny optimism, and brings vital energy & joy.
- Clear Quartz: Master energy amplifier that brings razor-sharp mental clarity and aids in fast manifestation.
- Black Obsidian: Impenetrable psychic protection, grounds fiery impulses, and clears negative energetic clutter.
- Garnet: Deepens passion, supports bold new beginnings, and anchors emotional stability.

Spiritual Properties & Energy:
Specifically consecrated for the trailblazing spirit of Aries. This bracelet balances the raw, dynamic fire of Mars with grounding obsidian and amplifying clear quartz, allowing you to conquer goals with fierce confidence while remaining energetically shielded, calm, and centered.

Why Wear:
- Empowers Aries natural leadership, ambition, and fearless courage
- Protects against burnout, stress, and outside negative energies
- Enhances career breakthroughs, new projects, and creative expansion
- Golden Aries astrological emblem radiates personal power and pride

Affirmation:
"I step boldly into my power with confidence, clarity, protection, and boundless energy."`
  },
  {
    name: "Ascension Taurus Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/taurus_zodiac_crystal_bracelet.png"],
    description: `Tagline: Strength • Stability • Abundance | Grounded • Peaceful • Prosperous

Zodiac Alignment: Taurus (♉) | April 20 – May 20 | Element: Earth | Ruling Planet: Venus

Gemstone Composition & Properties:
Featuring authentic hand-selected natural gemstone beads with an engraved Golden Taurus Astrological Charm:
- Green Aventurine: Attracts continuous prosperity, brings financial stability, and supports personal growth.
- Rose Quartz: The stone of unconditional love; heals emotional wounds, attracts loving connections, and brings deep inner peace.
- Tiger's Eye: Boosts self-confidence, provides resilient grounding protection, and enhances unwavering focus.
- Howlite: Gently calms an overthinking mind, reduces stress, and promotes graceful patience.
- Moss Agate: Stone of new beginnings; connects you deeply with Earth's restorative nature and restores inner balance.

Spiritual Properties & Energy:
Blessed for the steadfast, luxury-loving, and loyal Taurus spirit. Governed by Venus, this bracelet infuses your energy field with the comforting vibration of love, grounded wealth, emotional serenity, and earthy abundance.

Why Wear:
- Amplifies financial security, abundance, and business stability
- Fosters unconditional self-love and harmonious relationships
- Calms stubborn tension and soothes everyday anxieties
- Golden Taurus astrological emblem radiates beauty, strength, and serenity

Affirmation:
"I am deeply grounded in peace, surrounded by unconditional love, and open to endless abundance."`
  },
  {
    name: "Ascension Gemini Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/gemini_zodiac_crystal_bracelet.png"],
    description: `Tagline: Communication • Curiosity • Adaptability | Clear • Inspired • Expressive

Zodiac Alignment: Gemini (♊) | May 21 – June 20 | Element: Air | Ruling Planet: Mercury

Gemstone Composition & Properties:
Featuring premium hand-selected natural gemstone beads with an engraved Golden Gemini Astrological Charm:
- Amethyst: Calms the active mind, enhances spiritual intuition, and supports articulate, clear communication.
- Citrine: The radiant merchant's stone; brings joyful positivity, boosts confidence, and attracts opportunities.
- Howlite: Promotes soothing patience, reduces mental chatter and stress, and fosters emotional balance.
- Clear Quartz: Amplifies high cosmic frequencies, sharpens intellectual clarity, and supports laser focus.

Spiritual Properties & Energy:
Formulated for the quick-witted, expressive, and versatile energy of Gemini. Governed by Mercury, Gemini minds process countless thoughts at lightning speed. This bracelet brings balancing calmness through Amethyst & Howlite while enhancing joyful expression and abundance through Citrine & Clear Quartz.

Why Wear:
- Balances dualistic energy, calming anxiety and mental overwhelm
- Sharpens eloquence, communication, learning, and creative writing
- Enhances commercial success, manifestation, and optimistic vibes
- Golden Gemini astrological emblem radiates intellect, charm, and divine balance

Affirmation:
"My mind is clear, calm, and inspired. I express my truth with wisdom, joy, and confidence."`
  },
  {
    name: "Ascension Cancer Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/cancer_zodiac_crystal_bracelet.png"],
    description: `Tagline: Emotional • Intuitive • Protective | Harmony • Heart Healing • Divine Flow

Zodiac Alignment: Cancer (♋) | June 21 – July 22 | Element: Water | Ruling Planet: Moon

Gemstone Composition & Properties:
Featuring authentic hand-selected natural gemstone beads with an engraved Golden Cancer Astrological Charm:
- Blue Lace Agate / Blue Chalcedony: Soothes emotional overwhelm, restores inner calm, and supports peaceful authentic self-expression.
- Rainbow Moonstone: Sacred stone of lunar divine intuition, enhances psychic perception, and brings emotional balance with cyclical harmony.
- Clear Quartz: Amplifies sacred intentions, provides radiant aura cleansing, and sharpens intuitive foresight.

Spiritual Properties & Energy:
Formulated specifically for the deeply intuitive, empathetic, and protective energy of Cancer. Ruled by the Moon, Cancer's emotional world is vast and sacred. This bracelet creates a serene, protective aura cocoon, dissolving psychic sensitivity and emotional burnout while awakening profound intuitive clarity.

Why Wear:
- Deeply balances emotional tides and calms empathetic anxiety
- Enhances psychic dreams, spiritual intuition, and inner wisdom
- Shields delicate auric energy from toxic projections and negative environments
- Golden Cancer astrological emblem radiates grace, emotional mastery, and sacred protection

Affirmation:
"I trust my intuitive wisdom, protect my sacred energy, and flow with divine peace."`
  },
  {
    name: "Ascension Leo Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/leo_zodiac_crystal_bracelet.png"],
    description: `Tagline: Confidence • Creativity • Leadership | Radiance • Power • Solar Fire

Zodiac Alignment: Leo (♌) | July 23 – August 22 | Element: Fire | Ruling Planet: Sun

Gemstone Composition & Properties:
Featuring premium hand-selected natural gemstone beads with an engraved Golden Leo Astrological Charm:
- Golden Tiger's Eye: Unlocks fearless self-confidence, grounding protection, and executive decision-making.
- Citrine & Golden Rutile Quartz: Attracts boundless abundance, joyful solar magnetism, and royal creative manifestation.
- Sunstone & Yellow Jasper: Channels radiant solar vitality, ignites passionate leadership, and inspires generous warmth.

Spiritual Properties & Energy:
Blessed for the bold, majestic, and magnetic spirit of Leo. Governed by the radiant Sun, Leos are born leaders, visionaries, and creators. This bracelet infuses your chakras with sovereign solar fire, attracting wealth, creative breakthroughs, and unstoppable charisma.

Why Wear:
- Amplifies royal confidence, charismatic presence, and visionary leadership
- Unlocks creative flow, executive magnetism, and boundless abundance
- Protects your personal solar plexus power against jealousy and energy drains
- Golden Leo astrological emblem radiates royalty, triumph, and personal brilliance

Affirmation:
"I shine with radiant confidence, lead with an open heart, and create effortless abundance."`
  }
];

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ascension';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    for (const p of newProducts) {
      const existing = await Product.findOne({ name: p.name });
      if (existing) {
        existing.description = p.description;
        existing.pricing = p.pricing;
        existing.category = p.category;
        existing.stock = p.stock;
        existing.images = p.images;
        await existing.save();
        console.log(`Updated product: ${p.name}`);
      } else {
        await Product.create(p);
        console.log(`Created product: ${p.name}`);
      }
    }

    // Sync to extracted_products.json
    const extractedPath = path.join(__dirname, 'extracted_products.json');
    let fileProducts = [];
    if (fs.existsSync(extractedPath)) {
      try {
        fileProducts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
      } catch (e) {
        console.error('Error reading extracted_products.json:', e);
      }
    }

    for (const p of newProducts) {
      const idx = fileProducts.findIndex(fp => fp.name === p.name);
      if (idx !== -1) {
        fileProducts[idx] = { ...fileProducts[idx], ...p };
      } else {
        fileProducts.push(p);
      }
    }

    fs.writeFileSync(extractedPath, JSON.stringify(fileProducts, null, 2), 'utf8');
    console.log(`Successfully synced ${newProducts.length} new products to extracted_products.json.`);
  } catch (err) {
    console.error('Error adding products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

run();
