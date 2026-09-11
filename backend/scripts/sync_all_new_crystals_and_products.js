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
  numReviews: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const allProductsToSync = [
  {
    name: "Ascension Cleansing Crystal Bracelet",
    category: "Crystals",
    pricing: 799,
    stock: 50,
    images: ["/uploads/cleansing_crystal_bracelet.png"],
    description: `Tagline: Purify • Clarify • Elevate

Gemstone Composition: 100% Genuine Master Clear Quartz Crystal

Chakra & Aura Alignment: Crown Chakra & Soul Star Chakra | Purifying White & Prismatic Light

Spiritual Properties & Energy:
Known throughout spiritual traditions as the Supreme Master Healer, Clear Quartz holds the pristine vibrational frequency of cosmic clarity. This Sacred Cleansing Bracelet acts as a metaphysical prism, neutralizing energetic static, transmuting dense psychic debris, and elevating the wearer's aura into harmonious resonance.

Why Wear:
- Dissolves stagnant emotional heaviness and external psychic stress
- Amplifies mental clarity, spiritual focus, and meditative stillness
- Purifies and balances all 7 major chakras
- Amplifies the energy of other crystals and personal manifestations
- Provides an aura of pure, refreshing light

Affirmation:
"My mind, spirit, and energy field are purified in pristine crystal light and high cosmic vibrations."

How to Care & Charge:
Cleanse under cool running water or moonlight, and charge under gentle morning sunlight or on a Selenite charging plate.`
  },
  {
    name: "Ascension Abundance Crystal Bracelet",
    category: "Crystals",
    pricing: 1199,
    stock: 50,
    images: ["/uploads/abundance_crystal_bracelet.png"],
    description: `Tagline: Attract • Prosper • Manifest

Gemstone Composition: Genuine Natural Golden Citrine & Faceted Metallic Pyrite

Chakra & Aura Alignment: Solar Plexus Chakra & Sacral Chakra | Golden Solar Ray

Spiritual Properties & Energy:
A potent synergy of the "Merchant's Stone" (Citrine) and the "Stone of Golden Wealth" (Pyrite). This bracelet channels high-frequency solar abundance, dissolving subconscious scarcity blocks and empowering you with unwavering confidence to attract wealth, career breakthroughs, and boundless prosperity.

Why Wear:
- Attracts financial prosperity, unexpected opportunities, and career expansion
- Ignites drive, entrepreneurial confidence, and creative leadership
- Deflects scarcity mindset and impostor syndrome
- Shields your energetic field with Pyrite's metallic defensive barrier
- Anchors continuous flow and generosity in life

Affirmation:
"I am an open conduit for limitless divine prosperity, luxury, and success."

How to Care & Charge:
Charge under warm sunlight to revitalize Citrine and Pyrite's solar energies. Avoid soaking in water for extended periods.`
  },
  {
    name: "Ascension Health Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/health_crystal_bracelet.png"],
    description: `Tagline: Heal • Revitalize • Flourish

Gemstone Composition: High-Grade Green Aventurine & Master Clear Quartz

Chakra & Aura Alignment: Heart Chakra & Crown Chakra | Soothing Emerald & Crystalline Light

Spiritual Properties & Energy:
Crafted with the "Stone of Opportunity and Vitality" (Green Aventurine) paired with amplifying Clear Quartz, this bracelet envelops your energetic body in soothing, regenerative life force (Prana/Chi). It eases physical and emotional fatigue, supports cellular rejuvenation, and restores gentle harmony to your heart and nervous system.

Why Wear:
- Enhances physical vitality, stamina, and energetic renewal
- Soothes emotional burnout, stress, and nervous tension
- Harmonizes the Heart Chakra with compassion and emotional balance
- Accelerates the body's natural recuperation and holistic wellbeing
- Cleanses the bloodstream of energetic heaviness

Affirmation:
"My body is a sacred sanctuary of boundless health, vibrant energy, and restorative life force."

How to Care & Charge:
Cleanse with sage smoke or clear running water, and recharge in nature beside vibrant green plants or under gentle morning sunlight.`
  },
  {
    name: "Ascension Love & Peace Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/love_peace_crystal_bracelet.png"],
    description: `Tagline: Harmonize • Cherish • Radiate

Gemstone Composition: Madagascar Rose Quartz & Luminescent Clear Quartz

Chakra & Aura Alignment: Heart Chakra & Higher Heart Chakra | Soft Pink & Golden Light

Spiritual Properties & Energy:
Vibrating with the unconditional frequency of universal compassion, Madagascar Rose Quartz heals emotional wounds, softens the heart walls, and draws soulmate connections into your life. Paired with Clear Quartz, it radiates deep inner serenity, gentle forgiveness, and profound self-love.

Why Wear:
- Attracts harmonious romantic love, soulful friendships, and affectionate relationships
- Heals past emotional heartbreaks, grief, and self-criticism
- Cultivates profound inner peace, gentleness, and emotional stability
- Soothes relationship friction and enhances compassionate communication
- Reconnects you with the boundless love of the Universe

Affirmation:
"My heart is open to receive and radiate pure divine love and eternal peace."

How to Care & Charge:
Cleanse with gentle floral mist or incense smoke, and recharge under the soft glow of the Full Moon.`
  },
  {
    name: "Ascension Protection Crystal Bracelet",
    category: "Crystals",
    pricing: 1199,
    stock: 50,
    images: ["/uploads/protection_crystal_bracelet.png"],
    description: `Tagline: Shield • Ground • Defend

Gemstone Composition: Golden Tiger's Eye & Shielding Black Obsidian

Chakra & Aura Alignment: Root Chakra & Solar Plexus Chakra | Grounding Earth & Golden Fire

Spiritual Properties & Energy:
An impenetrable armor for your energetic field. The combination of fierce Golden Tiger's Eye and volcanic Black Obsidian repels psychic attacks, negative vibrations, toxic intentions, and energy vampires, while anchoring your consciousness into deep, centered grounding and personal sovereignty.

Why Wear:
- Forms an energetic shield against negative energy, evil eye (Nazar), and emotional vampires
- Deeply grounds chaotic or anxious thoughts into calm stability
- Boosts courage, instinctual protection, and personal boundaries
- Shields you in crowded, stressful, or toxic environments
- Enhances mental clarity and decisive willpower

Affirmation:
"I am safe, deeply grounded, and surrounded by an impenetrable divine shield of light."

How to Care & Charge:
Cleanse regularly with White Sage or Palo Santo smoke, and recharge on the earth or with Black Tourmaline / Selenite.`
  },
  {
    name: "Ascension Manifestation Crystal Bracelet",
    category: "Crystals",
    pricing: 799,
    stock: 50,
    images: ["/uploads/manifestation_crystal_bracelet.png"],
    description: `Tagline: Intend • Awaken • Manifest

Gemstone Composition: 100% Genuine Deep Purple Royal Amethyst

Chakra & Aura Alignment: Third Eye Chakra & Crown Chakra | Royal Violet & Violet Flame Light

Spiritual Properties & Energy:
Known as the stone of spiritual awakening and cosmic transmutation, natural Amethyst bridges your conscious intentions with the quantum field of infinite manifestation. By clearing mental static and calming the nervous system, Amethyst activates intuitive foresight, aligns your subconscious desires with divine timing, and turns your deepest aspirations into physical reality.

Why Wear:
- Amplifies the power of daily manifestations, affirmations, and goal setting
- Stimulates the Third Eye for enhanced intuition, lucid dreams, and psychic awareness
- Clears mental brain fog, overthinking, and restless anxiety
- Transmutes lower vibrational thoughts into higher consciousness and serenity
- Connects you with higher spiritual guidance and synchronicities

Affirmation:
"I align my intentions with the universe; what I seek is already seeking me."

How to Care & Charge:
Cleanse with sacred sage smoke, lavender water, or under the starry night sky. Recharge in moonbeams or alongside Selenite.`
  },
  {
    name: "Ascension Tiger Eye Crystal Bracelet",
    category: "Crystals",
    pricing: 699,
    stock: 50,
    images: ["/uploads/tiger_eye_single_bracelet.jpg"],
    description: `Tagline: Courage • Willpower • Focus

Gemstone Composition: 100% Natural Golden Brown Chatoyant Tiger's Eye

Chakra & Aura Alignment: Solar Plexus Chakra & Root Chakra | Golden Amber & Earth Energy

Spiritual Properties & Energy:
Revered throughout ancient civilizations as the Stone of the Courageous Warrior, Tiger's Eye radiates dynamic grounding golden-brown frequencies. It unlocks unshakeable self-confidence, sharp mental focus, and unwavering resilience through adversity, while stabilizing emotions and empowering decisive action.

Why Wear:
- Ignites fearless self-confidence, inner power, and courage
- Sharpens focus, practical logic, and executive decision-making
- Transmutes fear and hesitation into purposeful action
- Balances the Solar Plexus, fostering healthy boundaries and leadership
- Shields the auric field from jealousy, envy, and negative projections

Affirmation:
"I move forward with fierce courage, clarity, and unwavering confidence."

How to Care & Charge:
Cleanse with running water or incense smoke, and recharge in warm midday sunlight to activate its golden solar fire.`
  },
  {
    name: "Ascension Pyrite Crystal Bracelet",
    category: "Crystals",
    pricing: 699,
    stock: 50,
    images: ["/uploads/pyrite_crystal_bracelet.png"],
    description: `Tagline: Prosperity • Golden Energy • Shield

Gemstone Composition: 100% Genuine Faceted Metallic Golden Pyrite (Fool's Gold)

Chakra & Aura Alignment: Solar Plexus Chakra & Sacral Chakra | Metallic Gold & Earth Fire

Spiritual Properties & Energy:
Known as the ultimate "Money Magnet" and Fire Element stone, Pyrite holds a mirror-like metallic luster that deflects negative environmental energy and psychic drain. It stimulates the solar plexus, igniting personal power, financial leadership, ambitious goal achievement, and an aura of golden abundance.

Why Wear:
- Magnetic attraction for financial abundance, wealth, and commercial success
- Powerful energetic shield that deflects environmental pollutants and negative projections
- Eliminates fatigue and self-doubt, restoring vital physical stamina
- Inspires ambitious action, persistence, and financial discipline
- Strengthens personal willpower and magnetic charisma

Affirmation:
"I am magnetic to wealth, opportunities, and infinite prosperity."

How to Care & Charge:
Cleanse with sacred smoke (sage/camphor) or dry Himalayan salt. Keep away from excessive water to preserve its mirror-like metallic shine.`
  },
  {
    name: "Ascension Pocha Salt",
    category: "Bath Salts",
    pricing: 299,
    stock: 50,
    images: ["/uploads/pocha_salt.png"],
    description: `Tagline: Clean Spaces • Brighter Days • Good Energy Only

Turn everyday floor mopping into a powerful sacred space cleansing ritual with Ascension Pocha Salt. Formulated with authentic sea salt crystals, Himalayan pink rock minerals, natural camphor extracts, and purifying botanical herbs, it neutralizes heavy vibrations, removes Nazar (evil eye), dissolves stagnant negative energy, and purifies your home or workplace environment.

Why Use:
- Clears stagnant, heavy, or toxic energies from floors and entryways
- Shields the home from negative influences, jealousy, and evil eye (Nazar)
- Elevates room vibration, promoting peace, positivity, and harmony
- Eliminates energetic clutter accumulated from visitors and daily stress
- Ideal for daily mopping, Tuesday/Saturday spiritual purification, and housewarming (Griha Pravesh)

Ingredients:
Natural Himalayan Pink Salt, Sea Salt Crystals, Camphor Infusion, Dried Basil & Mint Extracts, Purifying Herbal Minerals.

How to Use:
1. Add 1 to 2 tablespoons of Ascension Pocha Salt into a bucket of clean mopping water.
2. Stir well until dissolved while setting a positive intention for your home (e.g., "May peace, health, and prosperity enter this home; may all negativity leave.").
3. Mop your home starting from the innermost room moving outward towards the main entrance.
4. Discard used water outside the main living area.

When to Use:
- Daily or weekly home and office cleaning
- After arguments, illness, or stressful visitors
- Before festive occasions, pujas, or spiritual gatherings
- Moving into a new home or workspace`
  },
  {
    name: "Ascension Sacred White Sage Leaves Smudge Bundles",
    category: "Camphor & Incense",
    pricing: 999,
    stock: 50,
    images: ["/uploads/sage_leaves_bundle.png"],
    description: `Tagline: Purify • Bless • High Vibrations

Authentic Organic California White Sage Smudge Sticks (Pack of 4). Clear dense emotional residue, stagnant air, and unwanted spiritual energies with Ascension Sacred White Sage. Hand-tied and sun-dried to perfection, burning sacred White Sage (Salvia apiana) is an ancient, time-honored ceremony used for thousands of years to cleanse spaces, purify crystals, reset auric fields, and invite higher celestial blessings.

Why Use:
- Deep spiritual purification and aura clearing
- Eliminates airborne negative ions, bacteria, and stagnant spiritual fog
- Prepares spaces for deep meditation, prayer, tarot, and energy healing rituals
- Cleanses and recharges crystals, jewelry, and sacred amulets
- Restores positive flow, peace, and spiritual protection to living spaces

How to Use:
1. Light the tip of a sage smudge stick at a 45-degree angle until it catches fire.
2. Allow it to burn for 20–30 seconds, then gently blow out the flame to let the holy cleansing smoke smolder.
3. Walk around your room or space, wafting the smoke into corners, doorways, and windows with mindful intention.
4. Place in a heat-proof abalone shell, ceramic dish, or bowl until completely extinguished.

Package Contents:
4 x Premium California White Sage Smudge Sticks ("Good Energy Only").`
  }
];

async function syncProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ascension';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Update/Upsert products in MongoDB
    for (const p of allProductsToSync) {
      const existing = await Product.findOne({ name: p.name });
      if (existing) {
        existing.description = p.description;
        existing.pricing = p.pricing;
        existing.category = p.category;
        existing.stock = p.stock;
        existing.images = p.images;
        await existing.save();
        console.log(`Updated product: ${p.name} (₹${p.pricing})`);
      } else {
        await Product.create(p);
        console.log(`Created product: ${p.name} (₹${p.pricing})`);
      }
    }

    // 2. Sync into extracted_products.json
    const extractedPath = path.join(__dirname, 'extracted_products.json');
    let fileProducts = [];
    if (fs.existsSync(extractedPath)) {
      try {
        fileProducts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
      } catch (e) {
        console.error('Error reading extracted_products.json:', e);
      }
    }

    for (const p of allProductsToSync) {
      const idx = fileProducts.findIndex(fp => fp.name === p.name);
      if (idx !== -1) {
        fileProducts[idx] = { ...fileProducts[idx], ...p };
      } else {
        fileProducts.push(p);
      }
    }

    fs.writeFileSync(extractedPath, JSON.stringify(fileProducts, null, 2), 'utf8');
    console.log(`Synchronized ${allProductsToSync.length} products to extracted_products.json.`);

    console.log('All products successfully synced!');
  } catch (error) {
    console.error('Error syncing products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

syncProducts();
