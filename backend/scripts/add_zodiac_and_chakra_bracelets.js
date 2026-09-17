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
  },
  {
    name: "Ascension Virgo Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/virgo_zodiac_crystal_bracelet.png"],
    description: `Tagline: Practical • Analytical • Kind | Purity • Focus • Radiant Health

Zodiac Alignment: Virgo (♍) | August 23 – September 22 | Element: Earth | Ruling Planet: Mercury

Gemstone Composition & Properties:
Featuring authentic hand-selected natural gemstone beads with an engraved Golden Virgo Astrological Charm:
- Green Jade & Aventurine: Attracts wholesome vitality, harmonizes heart energy, and promotes deep physical healing.
- White Quartz & Moonstone: Gently calms perfectionist overthinking, brings mental clarity, and supports intuitive balance.
- Moss Agate: Grounds daily routines with restorative earthy peace and enhances practical prosperity.
- Clear Quartz: Amplifies analytical focus, purifies energetic fields, and sharpens organization.

Spiritual Properties & Energy:
Crafted for the devoted, detail-oriented, and noble spirit of Virgo. Governed by Mercury, Virgos channel profound healing and analytical wisdom. This bracelet clears nervous exhaustion and mental clutter while grounding you in serene vitality and loving self-compassion.

Why Wear:
- Calms perfectionist anxiety, stress, and nervous fatigue
- Enhances analytical precision, focus, and organized execution
- Supports cellular vitality, digestive harmony, and overall wellness
- Golden Virgo astrological emblem radiates purity, kindness, and meticulous brilliance

Affirmation:
"I cultivate wellness, embrace clarity, and serve my highest path with wisdom and kindness."`
  },
  {
    name: "Ascension Libra Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/libra_zodiac_crystal_bracelet.png"],
    description: `Tagline: Harmony • Balance • Love | Beauty • Serenity • Soul Connection

Zodiac Alignment: Libra (♎) | September 23 – October 22 | Element: Air | Ruling Planet: Venus

Gemstone Composition & Properties:
Featuring exquisite natural gemstone beads with an engraved Golden Libra Astrological Charm:
- Rose Quartz: Awakens unconditional love, deep emotional healing, and dissolves relational conflicts.
- Amethyst: Restores serene mental equilibrium, enhances spiritual intuition, and clears decision paralysis.
- Moonstone: Brings emotional diplomacy, cyclical harmony, and soothing lunar grace.
- Clear Quartz: Balances energetic polarities and radiates pure crystalline clarity.

Spiritual Properties & Energy:
Blessed for the diplomatic, aesthetic, and heart-centered energy of Libra. Ruled by Venus, Libras thrive in harmonious, peaceful, and loving environments. This bracelet balances intellectual indecision with heart-centered confidence, attracting soulful relationships and divine peace.

Why Wear:
- Fosters unconditional love, emotional balance, and relationship harmony
- Dissolves dilemma overthinking, indecision, and energetic disharmony
- Magnifies artistic aesthetic charm, diplomatic magnetism, and social grace
- Golden Libra astrological emblem radiates fairness, beauty, and equilibrium

Affirmation:
"I am centered in divine peace, open to unconditional love, and balanced in all my relationships."`
  },
  {
    name: "Ascension Scorpio Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/scorpio_zodiac_crystal_bracelet.png"],
    description: `Tagline: Passionate • Intuitive • Transformative | Inner Power • Psychic Shield • Renewal

Zodiac Alignment: Scorpio (♏) | October 23 – November 21 | Element: Water | Ruling Planet: Pluto & Mars

Gemstone Composition & Properties:
Featuring powerful natural gemstone beads with an engraved Golden Scorpio Astrological Charm:
- Deep Amethyst: Channels profound spiritual transformation, psychic insight, and mental serenity.
- Black Obsidian & Tourmaline: Forms an impenetrable energetic fortress, repelling psychic attacks and absorbing dark energies.
- Smoky Quartz: Transmutes intense emotional grief or stress into grounded personal empowerment.
- Clear Quartz: Amplifies mystical rebirth, purification, and razor-sharp intuitive vision.

Spiritual Properties & Energy:
Consecrated for the magnetic, intense, and transformative energy of Scorpio. Governed by Pluto, Scorpio holds unmatched power for personal rebirth and deep emotional mastery. This bracelet grounds raw passion into purposeful triumph while shielding your psychic aura from lower vibrational interference.

Why Wear:
- Protects the psychic field against psychic drains, jealousy, and negative energy
- Transmutes emotional intensity and trauma into unstoppable personal empowerment
- Deepens spiritual rebirth, mystic intuition, and occult discernment
- Golden Scorpio astrological emblem radiates magnetic mystery, power, and triumph

Affirmation:
"I release the old with grace, embrace my intuitive power, and transform with fearless strength."`
  },
  {
    name: "Ascension Sagittarius Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/sagittarius_zodiac_crystal_bracelet.png"],
    description: `Tagline: Adventurous • Optimistic • Truth-Seeking | Wisdom • Expansion • Good Fortune

Zodiac Alignment: Sagittarius (♐) | November 22 – December 21 | Element: Fire | Ruling Planet: Jupiter

Gemstone Composition & Properties:
Featuring vibrant natural gemstone beads with an engraved Golden Sagittarius Astrological Charm:
- Royal Lapis Lazuli: Activates the Third Eye & Throat Chakra for truth, higher wisdom, and cosmic vision.
- Golden Citrine: Attracts continuous prosperity, auspicious luck, and boundless expansive optimism.
- Amethyst: Connects philosophical curiosity with spiritual intuition and peaceful discernment.
- Clear Quartz: Amplifies manifestation speed, sharp focus, and expansive aspirations.

Spiritual Properties & Energy:
Formulated for the vision-driven, philosophical, and free-spirited archer of Sagittarius. Governed by Jupiter, the planet of luck and grand expansion, this bracelet magnifies your auspicious fortunes, shields you on long travels, and aligns your daily actions with universal truth.

Why Wear:
- Attracts expansive good luck, wealth opportunities, and auspicious synchronicities
- Enhances philosophical wisdom, articulate truth-seeking, and higher learning
- Protects travelers and adventurous souls while maintaining joyful optimism
- Golden Sagittarius astrological emblem radiates fearless truth, joy, and victory

Affirmation:
"I expand my horizons, align with cosmic wisdom, and attract limitless opportunities and joy."`
  },
  {
    name: "Ascension Capricorn Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/capricorn_zodiac_crystal_bracelet.png"],
    description: `Tagline: Disciplined • Ambitious • Strong | Mastery • Resilience • Unshakable Success

Zodiac Alignment: Capricorn (♑) | December 22 – January 19 | Element: Earth | Ruling Planet: Saturn

Gemstone Composition & Properties:
Featuring premium grounded gemstone beads with an engraved Golden Capricorn Astrological Charm:
- Black Onyx & Obsidian: Unyielding root grounding, shields ambitious leaders from burnout and negative projections.
- Smoky Quartz: Dissolves stress, fear, and heavy responsibilities into pragmatic resilience.
- Mystical Labradorite: Awakens strategic intuition, persevering magic, and unlocks career breakthroughs.
- Clear Quartz: Clarifies long-term empire-building vision and masterfully amplifies goal achievement.

Spiritual Properties & Energy:
Blessed for the ambitious, disciplined, and unshakable empire-builder of Capricorn. Governed by Saturn, the master of mastery and time, this bracelet empowers you with immense stamina, perseverance, and strategic clarity to climb every mountain and claim lasting success.

Why Wear:
- Fortifies unshakable discipline, patience, and executive resilience
- Protects against professional burnout, heavy burdens, and mental fatigue
- Magnetizes career breakthroughs, empire-building stability, and lasting wealth
- Golden Capricorn astrological emblem radiates authority, mastery, and enduring strength

Affirmation:
"I build my legacy with discipline and patience, grounded in unwavering strength and success."`
  },
  {
    name: "Ascension Aquarius Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/aquarius_zodiac_crystal_bracelet.png"],
    description: `Tagline: Innovative • Independent • Humanitarian | Vision • Cosmic Flow • Higher Intellect

Zodiac Alignment: Aquarius (♒) | January 20 – February 18 | Element: Air | Ruling Planet: Uranus & Saturn

Gemstone Composition & Properties:
Featuring celestial natural gemstone beads with an engraved Golden Aquarius Astrological Charm:
- Royal Lapis Lazuli: Activates higher intellectual vision, cosmic consciousness, and boundless inventive intuition.
- Aquamarine: Clears communication channels, brings flowing mental calm, and dissolves rigid mental blocks.
- Rainbow Moonstone & Labradorite: Connects personal vision with universal frequency, awakening innovative genius.
- Clear Quartz: Supercharges quantum clarity and manifestation of progressive ideas.

Spiritual Properties & Energy:
Formulated for the trailblazing visionary, rebel, and humanitarian spirit of Aquarius. Governed by Uranus, Aquarius brings forward revolutionary ideas that change the world. This bracelet keeps your upper chakras electrified with inspiration while maintaining smooth energetic flow and mental freedom.

Why Wear:
- Ignites out-of-the-box innovative thinking, inventiveness, and higher intellect
- Protects visionary leaders from mental burnout, cognitive overload, and static energy
- Fosters authentic independence, humanitarian connection, and cosmic awareness
- Golden Aquarius astrological emblem radiates individuality, genius, and cosmic flow

Affirmation:
"I channel visionary breakthroughs, honor my authentic truth, and inspire universal elevation."`
  },
  {
    name: "Ascension Pisces Zodiac Sign Crystal Bracelet",
    category: "Crystals",
    pricing: 999,
    stock: 50,
    images: ["/uploads/pisces_zodiac_crystal_bracelet.png"],
    description: `Tagline: Intuitive • Compassionate • Creative | Mystic Dreams • Soul Serenity • Universal Love

Zodiac Alignment: Pisces (♓) | February 19 – March 20 | Element: Water | Ruling Planet: Neptune & Jupiter

Gemstone Composition & Properties:
Featuring dreamy mystical gemstone beads with an engraved Golden Pisces Astrological Charm:
- Deep Amethyst: Sacred stone of mystical awakening, psychic intuition, and serene spiritual protection.
- Aquamarine & Fluorite: Channels soothing oceanic peace, washes away emotional overwhelm, and unlocks creative imagination.
- Rainbow Moonstone: Deepens connection to cyclical divine wisdom, lucid dreaming, and universal compassion.
- Clear Quartz: Master purifier that protects delicate empathic auras while amplifying artistic flow.

Spiritual Properties & Energy:
Consecrated for the mystic, dreamer, and soulful healer of Pisces. Ruled by Neptune, Pisces navigates the oceanic depths of emotions and spiritual realms. This bracelet creates a luminous protective shield around your empathic aura, transmuting emotional overwhelm into profound artistic creativity and peace.

Why Wear:
- Shields highly sensitive empathic energy from outside psychic clutter
- Awakens mystical dreams, heightened spiritual intuition, and artistic flow
- Soothes restless anxiety and connects deeply with universal love
- Golden Pisces astrological emblem radiates soulful grace, mystic wisdom, and divine creativity

Affirmation:
"I flow with boundless compassion, trust my psychic dreams, and anchor divine peace in every moment."`
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
