const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

const boatCandles = [
  {
    name: "Ascension Abundance Boat Candle",
    category: "Candles",
    pricing: 899,
    stock: 50,
    images: ["/uploads/abundance_boat_candle_1.png"],
    description: "Tagline: Attract • Align • Manifest\n\nCreate an intentional ritual for abundance, prosperity, success and new opportunities with the Ascension Abundance Boat Candle.\n\nHand-poured into a sacred natural wooden boat vessel with multi-wick illumination, dried botanical cinnamon sticks, cloves and charged abundance crystals, this boat candle creates a dedicated, expansive space to focus your thoughts and intentions on the abundance you wish to cultivate. Whether your intention is financial prosperity, career growth, business success, creativity, recognition or greater opportunities, lighting this candle creates a powerful reminder to stay open to receiving while taking conscious action towards your goals.\n\nWhy Use:\n- Set intentions for financial prosperity and abundance\n- Multi-wick illumination for broad energy projection\n- Support manifestation and visualization practices\n- Cultivate a mindset of growth and possibility\n- Focus on career, business and professional goals\n- Create a calm atmosphere for journaling and goal-setting\n- Complement meditation, prayer and spiritual practices\n- Encourage gratitude for the abundance already present in your life\n\nIngredients:\nNatural Soy & Beeswax blend, Pure Essential Oils (Frankincense, Orange, Patchouli), Sacred Botanicals (Cinnamon Sticks, Black Pepper, Basil Leaves), Charged Abundance Crystals.\n\nHow to Use:\n1. Place the boat candle on a stable, heat-resistant and non-flammable surface.\n2. Before lighting it, take a few deep breaths and clearly identify your intention.\n3. Light all wicks mindfully.\n4. Sit comfortably and focus on your desired outcome.\n5. Visualise yourself moving towards your goals and experiencing the feelings associated with abundance.\n6. Repeat an affirmation such as: \"I am open to abundance in all areas of my life. I recognise opportunities, take inspired action and allow prosperity to grow.\"\n7. Spend 10–15 minutes in meditation, visualization or journaling.\n8. Extinguish safely when your ritual is complete.\n\nImportant Information:\nFor ritual and ambience use only. Never leave burning candle unattended. Keep away from flammable materials, children, and pets."
  },
  {
    name: "Ascension Cleansing Boat Candle",
    category: "Candles",
    pricing: 899,
    stock: 50,
    images: ["/uploads/cleansing_boat_candle_1.png"],
    description: "Tagline: Cleanse • Release • Renew\n\nCreate a sacred ritual of cleansing, release and renewal with the Ascension Cleansing Boat Candle.\n\nHandcrafted with exquisite carved floral wax botanicals, multi-wick ambient radiance, and detoxifying essential oils, this cleansing boat candle is designed to clear emotional heaviness, release what no longer serves you and refresh the energy and atmosphere of your surroundings.\n\nLighting this candle becomes a powerful symbolic practice—a conscious transition from what you are ready to let go of towards the peace, clarity and freshness you wish to invite into your life.\n\nWhy Use:\n- Create an intentional cleansing and renewal ritual\n- Multi-wick illumination for wide space energy purification\n- Symbolically release stress, emotional heaviness and unwanted thoughts\n- Create a calm and peaceful atmosphere\n- Support meditation, prayer and mindfulness practices\n- Refresh the feeling of your home or personal space\n\nIngredients:\nNatural Wax with carved floral botanicals, Essential Oils (Lavender, Lemongrass, Tea Tree Oil), Sacred Herbs (Basil Leaves, Lemon Peels), Charged Cleansing Crystals.\n\nHow to Use:\n1. Place the candle on a stable, heat-resistant surface.\n2. Take a few slow, deep breaths and settle yourself.\n3. Before lighting the candle, identify what you wish to release.\n4. Light the wicks mindfully.\n5. Gently focus on the flame and imagine heaviness leaving your space.\n6. Set your intention: \"I release what no longer serves me. I clear what feels heavy and make space for peace, clarity, light and renewal.\"\n7. Spend 10–15 minutes in quiet reflection, meditation or journaling.\n8. Extinguish safely when complete.\n\nImportant Information:\nFor ritual and ambience use only. Never leave burning candle unattended. Keep away from drafts, children, and pets."
  },
  {
    name: "Ascension Protection Boat Candle",
    category: "Candles",
    pricing: 899,
    stock: 50,
    images: ["/uploads/protection_boat_candle_1.png"],
    description: "Tagline: Protect • Ground • Strengthen\n\nCreate a calming ritual of protection, grounding and inner strength with the Ascension Protection Boat Candle.\n\nCrafted in a sacred stone vessel with multi-wick radiance, dark protective botanicals, blue sacred herbs, and charged crystals, this candle provides a dedicated space to consciously release fear, stress and emotional heaviness while strengthening your personal energy shield.\n\nProtection is about creating awareness around your boundaries, grounding yourself and intentionally choosing the peaceful energy you cultivate around you.\n\nWhy Use:\n- Create an intentional protection and aura shielding ritual\n- Multi-wick illumination for powerful protective energy barrier\n- Encourage feelings of grounding and stability\n- Support rituals focused on clearing emotional heaviness\n- Create a peaceful and secure-feeling atmosphere\n- Complement meditation, prayer and spiritual practices\n\nIngredients:\nNatural Wax, Pure Essential Oils (Rose, Sandalwood, Frankincense, Lemon Oil), Sacred Botanicals (Neem, Bay Leaf, Clove, Dark Petals), Charged Protection Crystals.\n\nHow to Use:\n1. Place the candle on a stable, heat-resistant surface.\n2. Sit comfortably and take 3–5 slow, deep breaths.\n3. Before lighting the candle, identify what you wish to release.\n4. Light the wicks mindfully.\n5. Focus your attention on the flames and visualise yourself surrounded by a protective light.\n6. Set your intention: \"I am grounded, protected and at peace. I release what does not belong to me and remain connected to my own energy.\"\n7. Spend 10–15 minutes in quiet reflection, meditation or prayer.\n8. Extinguish safely when complete.\n\nImportant Information:\nFor ritual and ambience use only. Never leave burning candle unattended. Keep away from flammable materials, children, and pets."
  }
];

async function updateProducts() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // 1. Remove Sage Leaves from DB
    const delSage = await Product.deleteMany({
      $or: [
        { category: "Sage Leaves" },
        { name: /sage leaves/i }
      ]
    });
    console.log(`Deleted ${delSage.deletedCount} Sage Leaves products from DB.`);

    // 2. Add or update Boat Candles
    for (const candle of boatCandles) {
      const existing = await Product.findOne({ name: candle.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: candle });
        console.log(`Updated: ${candle.name}`);
      } else {
        await Product.create(candle);
        console.log(`Created: ${candle.name}`);
      }
    }

    // 3. Update extracted_products.json
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      let currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      // Remove Sage leaves
      currentList = currentList.filter(p => p.category !== "Sage Leaves" && !p.name.toLowerCase().includes("sage leaves"));
      // Add or update boat candles
      for (const candle of boatCandles) {
        const idx = currentList.findIndex(p => p.name === candle.name);
        if (idx !== -1) {
          currentList[idx] = candle;
        } else {
          currentList.push(candle);
        }
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log('Updated extracted_products.json without sage leaves and with boat candles.');
    }

    const total = await Product.countDocuments();
    console.log(`Total products in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating products:', err);
    process.exit(1);
  }
}

updateProducts();
