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
  numReviews: { type: Number, default: 24 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const pyramidProducts = [
  {
    name: "Ascension 7 Chakra Orgone Energy Pyramid",
    category: "Pyramids",
    pricing: 999,
    stock: 50,
    images: ["/uploads/seven_chakra_orgone_pyramid.png"],
    description: `Tagline: Balance • Align • Energy Generator • EMF Shield | Sacred Geometry & 7 Chakra Alignment

Composition & Sacred Elements:
Features authentic 7-layer polished gemstone chips with a top Quartz Crystal Point, Copper Energy Vortex Spiral, and genuine Gold Flakes encased in clear orgonite resin:
1. Sahasrara (Crown): Amethyst — Spiritual clarity & higher consciousness
2. Ajna (Third Eye): Lapis Lazuli — Intuition & psychic insight
3. Vishuddha (Throat): Turquoise / Aquamarine — Clear communication & truth
4. Anahata (Heart): Green Aventurine — Compassion & abundance
5. Manipura (Solar Plexus): Tiger's Eye / Yellow Jasper — Courage & willpower
6. Svadhisthana (Sacral): Red Carnelian — Creativity & vitality
7. Muladhara (Root): Red Jasper / Garnet — Grounding & physical stamina

Spiritual Properties & Energy:
The 7 Chakra Orgone Pyramid acts as a continuous prana (life force) generator and environmental energy filter. Based on Wilhelm Reich's orgone energy principles and sacred pyramid geometry, it transmutes negative, stagnant energy and hazardous EMF radiation from electronic devices into vibrant, harmonious positive energy.

Where to Place:
- Living Room or Center of Home: Harmonizes family energy and radiates continuous positivity
- Office / Study Desk: Shields from computer and WiFi EMF radiation while sharpening focus
- Meditation / Yoga Altar: Amplifies intentions and balances all 7 chakras during spiritual practice

Affirmation:
"My space is filled with sacred harmony, radiant vitality, and pure positive energy."`
  },
  {
    name: "Ascension Black Tourmaline Orgone Energy Pyramid",
    category: "Pyramids",
    pricing: 999,
    stock: 50,
    images: ["/uploads/black_tourmaline_orgone_pyramid.png"],
    description: `Tagline: Supreme EMF Shield • Psychic Protection • Grounding | Ultimate Energetic Fortress

Composition & Sacred Elements:
Handcrafted with 100% genuine Black Tourmaline crystals, a sacred Copper Vortex Energy Coil, high-vibrational Gold Leaf flakes, and Clear Quartz amplifier encased in high-grade orgone resin.

Spiritual Properties & Energy:
Black Tourmaline is universally revered as the master stone of psychic protection and energetic purification. Combined with pyramid sacred geometry and orgonite matrix, this pyramid creates an impenetrable energetic boundary that absorbs and neutralizes negative thoughts, envy, psychic vampires, and harmful 5G/WiFi EMF radiation.

Where to Place:
- Near WiFi Routers, TVs, and Computers: Powerful EMF neutralizing barrier
- Main Entrance / Doorway: Blocks heavy or negative outside energies from entering your home
- Bedroom Nightstand: Grounding protection against night terrors, sleep restlessness, and psychic fatigue

Affirmation:
"I am completely protected, deeply grounded, and surrounded by divine light."`
  },
  {
    name: "Ascension Amethyst Orgone Energy Pyramid",
    category: "Pyramids",
    pricing: 999,
    stock: 50,
    images: ["/uploads/amethyst_orgone_pyramid.png"],
    description: `Tagline: Spiritual Awakening • Stress Relief • Deep Sleep | Violet Flame Peace & Intuition

Composition & Sacred Elements:
Features premium deep purple Brazilian Amethyst gemstone chips, an upward conducting Copper Energy Spiral, golden flakes, and a quartz activator matrix encased in clear orgonite resin.

Spiritual Properties & Energy:
Radiating with the high-vibrational frequencies of the Third Eye and Crown Chakras, the Amethyst Orgone Pyramid is a master tool for spiritual transmutation, deep stress relief, and psychic expansion. It cleanses the mental atmosphere, quietens overthinking, and invites angelic peace and restful, rejuvenating sleep.

Where to Place:
- Bedside Table / Bedroom: Promotes deep restorative sleep, vivid dream recall, and insomnia relief
- Meditation Corner / Sacred Space: Enhances intuition, connects with higher spiritual guides, and deepens trance
- Living Space: Transmutes stress and anxiety into calm serenity and household peace

Affirmation:
"My mind is peaceful, my spirit is serene, and I am aligned with divine intuition."`
  },
  {
    name: "Ascension Lapis Lazuli Orgone Energy Pyramid",
    category: "Pyramids",
    pricing: 999,
    stock: 50,
    images: ["/uploads/lapis_lazuli_orgone_pyramid.png"],
    description: `Tagline: Wisdom • Truth • Cosmic Vision • Third Eye Activation | The Stone of Kings & Mystics

Composition & Sacred Elements:
Featuring rich royal celestial blue Lapis Lazuli with golden pyrite flecks, a precision Copper Vortex Spiral, radiant gold leaf flakes, and clear orgonite matrix.

Spiritual Properties & Energy:
Prized since ancient Egyptian dynasties as the sacred stone of royalty and esoteric truth, Lapis Lazuli stimulates the Throat and Third Eye Chakras. This pyramid enhances self-expression, inspires visionary leadership, accelerates intuitive downloads, and aligns your mind with universal truth.

Where to Place:
- Work Office / Executive Desk: Sharpens decision-making, executive charisma, and articulate communication
- Study Room / Library: Accelerates learning, memory retention, and intellectual focus
- Sacred Altar: Awakens Third Eye psychic vision, tarot readings, and spiritual truth-seeking

Affirmation:
"I speak my truth with clarity, lead with wisdom, and see with enlightened vision."`
  },
  {
    name: "Ascension Rainbow Moonstone Orgone Energy Pyramid",
    category: "Pyramids",
    pricing: 999,
    stock: 50,
    images: ["/uploads/moonstone_orgone_pyramid.png"],
    description: `Tagline: Lunar Intuition • Emotional Balance • Divine Feminine Flow | Sacred Cycles & Inner Peace

Composition & Sacred Elements:
Crafted with authentic luminous Rainbow Moonstone gemstones showing blue flash, copper energy spiral, shimmering gold flakes, and clear orgonite resin.

Spiritual Properties & Energy:
Enveloped in the gentle, nurturing frequency of the Moon and divine feminine wisdom, the Moonstone Orgone Pyramid balances erratic emotional tides, soothes empathetic vulnerability, and awakens clairvoyant foresight. It supports smooth hormonal and cyclical harmony while radiating soothing lunar peace.

Where to Place:
- Bedroom / Healing Room: Calms emotional stress, fosters romantic harmony, and brings peaceful rest
- Creative Studio / Art Space: Ignites feminine creative flow, poetic inspiration, and imagination
- Personal Altar: Deepens connection to Moon cycles, new moon manifestations, and intuitive tarot/oracle work

Affirmation:
"I flow with graceful ease, trust my feminine intuition, and radiate divine peace."`
  }
];

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ascension';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    for (const p of pyramidProducts) {
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

    for (const p of pyramidProducts) {
      const idx = fileProducts.findIndex(fp => fp.name === p.name);
      if (idx !== -1) {
        fileProducts[idx] = { ...fileProducts[idx], ...p };
      } else {
        fileProducts.push(p);
      }
    }

    fs.writeFileSync(extractedPath, JSON.stringify(fileProducts, null, 2), 'utf8');
    console.log(`Successfully synced ${pyramidProducts.length} pyramid products to extracted_products.json.`);
  } catch (err) {
    console.error('Error adding pyramid products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

run();
