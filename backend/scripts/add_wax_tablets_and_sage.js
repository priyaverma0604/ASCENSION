const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

const newProducts = [
  {
    name: "Ascension Protection Wax Tablet",
    category: "Wax Tablets",
    pricing: 399,
    stock: 50,
    images: ["/uploads/protection_wax_tablet_1.png"],
    description: "Tagline: Energetic Safety • Aura Shielding • Peace\n\nEver Walked Into a Room and Felt Instantly Drained?\nWant to shield your space & energy from unseen negativity?\n\n• Protection Wax Tablets for Energetic Safety & Aura Shielding:\nInfused with potent protective herbs, essential oils & intention — these handcrafted wax tablets are designed to guard your space from negativity, low vibrations, and emotional clutter.\n\n• How it helps you:\nThese sacred wax tablets act as an energetic barrier. They:\n- Absorb and deflect negative energy & psychic stress\n- Keep your home, office, or personal space spiritually safe\n- Boost feelings of peace, clarity, and emotional strength\n- Enhance spiritual protection during rituals or sleep\n\n• How to Use:\n- Hang or place the wax tablet near your entrance, bed, work desk, or altar\n- Use in your car, closet, or purse for on-the-go protection\n- Replace or re-energize under Full Moon (Purnima) & New Moon (Amavasya)\n\nSimple. Natural. Powerful.\n\nTo order or inquire: Call/WhatsApp: 9891110273\nAscend to Wellness with Ascension Healing Products"
  },
  {
    name: "Ascension Health Wax Tablet",
    category: "Wax Tablets",
    pricing: 399,
    stock: 50,
    images: ["/uploads/health_wax_tablet_1.png"],
    description: "Tagline: Harmony • Wellness • Calm\n\n\"If Your Home Feels Drained… Your Health Might Be Too!\"\n\nInvite harmony, wellness & calm with our handcrafted Health Wax Tablet — made with healing herbs, essential oils & high vibrations to support your well-being inside out.\n\n• How It Helps You:\n- Promotes physical relaxation, harmony & deep calm\n- Restores vitality and positive life-force energy\n- Supports restful sleep and mindful healing space\n\n• How to Use:\n- Place it near your bed, meditation space, or work desk\n- Hang in areas where you feel stressed or heavy\n\n• Place It In:\n- Bedroom\n- Study corner\n- Wardrobe\n- Healing or prayer space\n\nPlease Note: Keep away from direct sunlight. Store in a cool, shaded area to preserve energy & fragrance.\n\nSimple. Natural. Powerful.\n\nTo order or inquire: Call/WhatsApp: 9891110273\nAscend to Wellness with Ascension Healing Products"
  },
  {
    name: "Ascension Cleansing Wax Tablet",
    category: "Wax Tablets",
    pricing: 399,
    stock: 50,
    images: ["/uploads/cleansing_wax_tablet_1.png"],
    description: "Tagline: Space Purification • Aura Cleansing • Freshness\n\nDoes Your Space Feel Heavy, Cluttered, or Spiritually Stagnant?\nCraving a fresh, light and energetically clean environment?\n\n• Cleansing Wax Tablets for Space & Aura Purification:\nCrafted with detoxifying herbs, essential oils & sacred energy — these handcrafted wax tablets are made to purify your surroundings and uplift your energy field.\n\n• How it helps you:\nThese tablets bring clarity, freshness, and vibrational lightness. They:\n- Remove negativity, stuck emotions, and low vibes\n- Refresh the atmosphere of your home, office, or sacred space\n- Cleanse your aura gently without smoke or fire\n- Support mindfulness, emotional reset & energy renewal\n\n• How to Use:\n- Place or hang near your entrance, windows, workspace, or puja area\n- Use in closets, drawers, or under pillows for subtle energetic cleansing\n- Re-charge under Full Moon (Purnima) & New Moon (Amavasya) for enhanced potency\n\nSimple. Natural. Powerful.\n\nTo order or inquire: Call/WhatsApp: 9891110273\nAscend to Wellness with Ascension Healing Products"
  },
  {
    name: "Ascension Love & Peace Wax Tablet",
    category: "Wax Tablets",
    pricing: 399,
    stock: 50,
    images: ["/uploads/love_peace_wax_tablet_1.png"],
    description: "Tagline: Transform Your Space into a Love Sanctuary\n\nLet every corner radiate loving energy with our Relationship & Love Wax Tablet by Ascension Healing — a harmonious blend crafted to nurture connections, heal hearts, and attract soulful relationships.\n\n• How It Helps You:\n- Softens emotional walls – Encourages openness and vulnerability\n- Draws in loving energy – Infuses your space with warmth and affection\n- Mends past hurts – Creates space for forgiveness and deeper bonding\n- Elevates your vibe – Surrounds you with gentle, heart-centered energy\n\n• How to Use:\n- For Couples: Place near bedside or in shared spaces to strengthen your bond\n- For Singles: Keep in your bedroom or closet to attract meaningful love\n- For Self-Love: Hold during meditation or place on your altar to reconnect with your heart\n\n• Place It In:\n- Bedside table | Closet drawers | Love altar | Gift boxes\n\nPlease Note:\n- For ambient fragrance & energy work only (do not burn)\n- Keep away from direct heat and sunlight\n- Replace every 4–6 weeks for renewed energy\n\nTo Order or Inquire: Call/WhatsApp: 9891110273\nAscension Healing Products"
  },
  {
    name: "Ascension Abundance Wax Tablet",
    category: "Wax Tablets",
    pricing: 399,
    stock: 50,
    images: ["/uploads/abundance_wax_tablet_1.png"],
    description: "Tagline: Attract Wealth • Clear Stagnancy • High Vibes\n\nWant Your Space to Attract Wealth & Peace?\nFeeling heavy or stuck at home? Bring in high vibes with our Abundance Wax Tablet — a divine blend of fragrance & energy that shifts your space into abundance mode!\n\n• How It Helps You:\n- Attracts wealth, luck & new opportunities\n- Clears stagnant energy & uplifts your mood\n- Brings peace and high vibrations to your space\n\n• Place It In:\n- Wardrobe, pooja room, study corner, or locker\n- Anywhere you wish to invite abundance\n\nPlease Note: Avoid direct sunlight. Keep in a cool, shaded spot.\n\nTo Order: Call/WhatsApp: 9891110273\nAscend to Abundance with Ascension Healing Products"
  },
  {
    name: "Ascension Sacred Dried Sage Leaves",
    category: "Sage Leaves",
    pricing: 349,
    stock: 50,
    images: ["/uploads/sage_leaves_1.jpeg"],
    description: "Tagline: Energy Cleansing • Aura Protection • Sacred Smoke\n\nFeeling Drained or Surrounded by Negative Vibes?\nNeed a quick energetic reset for your space and self?\n\n• Sage Leaves for Energy Cleansing & Aura Protection:\nThese sacred dried sage leaves have been used for centuries in spiritual practices to purify spaces, release stagnant energy, and protect your aura.\n\n• How it helps you:\nSage cleansing brings clarity, peace, and protection. It:\n- Clears negative energy from your home and body\n- Uplifts mood and removes energetic heaviness\n- Enhances meditation, focus, and spiritual rituals\n- Protects against psychic attacks & emotional burnout\n\n• How to Use:\n- Burn a small bundle or leaf in a heat-safe bowl and gently waft the smoke across your room, around your aura, or specific objects 🌫\n- Use during meditation, after arguments, or when energy feels “off”\n- Cleanse your space every Full Moon (Purnima) & New Moon (Amavasya) to refresh vibrations\n\nSimple. Natural. Powerful.\n\nTo order or inquire: Call/WhatsApp: 9891110273\nAscend to Wellness with Ascension Healing Products"
  }
];

async function addProducts() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    for (const prod of newProducts) {
      const existing = await Product.findOne({ name: prod.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: prod });
        console.log(`Updated product: ${prod.name}`);
      } else {
        await Product.create(prod);
        console.log(`Created product: ${prod.name}`);
      }
    }

    // Also update extracted_products.json to keep it in sync
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      for (const prod of newProducts) {
        const idx = currentList.findIndex(p => p.name === prod.name);
        if (idx !== -1) {
          currentList[idx] = prod;
        } else {
          currentList.push(prod);
        }
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log('Updated extracted_products.json with new products.');
    }

    const total = await Product.countDocuments();
    console.log(`Total products in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error adding products:', err);
    process.exit(1);
  }
}

addProducts();
