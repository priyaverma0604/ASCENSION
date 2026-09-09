const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');

// 1. Copy images
const imagesToCopy = [
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/b8f3a054-2344-4e0c-bb83-666d4c2dd313/.user_uploaded/media_1788963891550.jpg",
    filename: "love_peace_boat_candle.jpg"
  },
  {
    src: "C:/Users/Dell/.gemini/antigravity-ide/brain/b8f3a054-2344-4e0c-bb83-666d4c2dd313/.user_uploaded/media_1788963900784.jpg",
    filename: "health_boat_candle.jpg"
  }
];

for (const item of imagesToCopy) {
  const backendDest = path.join(__dirname, '..', 'uploads', item.filename);
  const frontendDest = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', item.filename);
  const assetsDest = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', item.filename);

  [backendDest, frontendDest, assetsDest].forEach(d => {
    fs.mkdirSync(path.dirname(d), { recursive: true });
    fs.copyFileSync(item.src, d);
    console.log(`Copied ${item.src} -> ${d} (size: ${fs.statSync(d).size})`);
  });
}

const newBoatCandles = [
  {
    name: "Ascension Love & Peace Boat Candle",
    category: "Candles",
    pricing: 899,
    stock: 50,
    images: ["/uploads/love_peace_boat_candle.jpg"],
    description: `Tagline: Love • Peace • Harmony

Create a beautiful ritual of love, peace, emotional harmony and inner calm with the Ascension Love & Peace Boat Candle.

Thoughtfully created to complement your spiritual wellness and self-care practices, this candle is designed to help you create a peaceful environment where you can slow down, release emotional heaviness and consciously invite more love, compassion, harmony and positivity into your life.

Whether you are nurturing self-love, working through emotional heaviness, setting intentions for harmonious relationships or simply creating a peaceful moment for yourself, the Love & Peace Candle can become a meaningful part of your daily ritual.

Why Use:
- Cultivate self-love and self-compassion
- Create a peaceful and harmonious atmosphere
- Encourage emotional calm and mindful reflection
- Support intentions around love and healthy relationships
- Complement meditation, prayer and mindfulness
- Create a ritual for forgiveness, acceptance and emotional release
- Support a peaceful evening or bedtime routine
- Complement manifestation and intention-setting practices

Ingredients:
Natural Wax, Pure Rose Essential Oil, Sacred Herbs (Rose Petals), Charged Rose Quartz Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Take a few slow, deep breaths and allow yourself to become present.
3. Before lighting the candle, decide what you wish to cultivate—love, peace, forgiveness, harmony or self-acceptance.
4. Light the candle mindfully.
5. Sit comfortably and gently focus on the flame.
6. Visualise yourself surrounded by a peaceful, loving energy.
7. Repeat an affirmation such as: "I choose love. I choose peace. I release what weighs on my heart and make space for harmony."
8. Spend 10–15 minutes in meditation, prayer, journaling or quiet reflection.
9. When finished, extinguish the candle safely.

For Self-Love & Emotional Healing:
Use the candle during moments dedicated to yourself. Write down something you are ready to release and something you wish to cultivate. As the candle burns, allow yourself to move from self-criticism towards acceptance, compassion and love.
Focus on: Self-Love • Acceptance • Forgiveness • Compassion • Inner Peace.

For Relationship Harmony:
The Love & Peace Candle can also be used when setting intentions for healthy and harmonious relationships. You may affirm: "I welcome healthy, loving and peaceful connections into my life. I give and receive love with openness, respect and understanding."

When to Use It:
- During self-love rituals
- Before meditation or prayer
- During journaling and reflection
- Before bedtime
- During manifestation practices
- After an emotionally difficult day
- When setting intentions for relationship harmony
- During personal spiritual practices
- Whenever you want to create a calm and loving atmosphere

Create Your Ritual:
For a deeper experience, create a quiet space and put away distractions.
Before lighting the candle, ask yourself:
What am I ready to release?
What am I ready to forgive?
What kind of love and peace do I want to cultivate?
Light the candle and spend a few moments focusing on the qualities you want to welcome.
Imagine the flame gently transforming:
Tension into peace.
Fear into trust.
Resentment into forgiveness.
Loneliness into connection.
Heaviness into lightness.
Allow the ritual to remind you that love and peace begin with the way you choose to care for yourself.

The Ascension Way:
At Ascension, we believe that love begins within and that peace is something we consciously cultivate.
The Ascension Love & Peace Boat Candle is an invitation to slow down, reconnect with your heart and create a meaningful ritual around self-love, emotional harmony and peaceful connections.
Release the heaviness.
Open your heart.
Choose peace.
Make space for love. 💗🕯️

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Love & Peace Candle is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee specific emotional, relationship or manifestation outcomes and is not intended to diagnose, treat or cure any medical condition.`
  },
  {
    name: "Ascension Health Boat Candle",
    category: "Candles",
    pricing: 899,
    stock: 50,
    images: ["/uploads/health_boat_candle.jpg"],
    description: `Tagline: Restore • Rejuvenate • Renew

Create a calming ritual of wellness, relaxation and renewal with the Ascension Health Boat Candle.

Thoughtfully created to complement your personal wellness and spiritual practices, this candle is designed to help you create a peaceful environment where you can slow down, quiet the mind and reconnect with your intention for health, vitality and overall wellbeing.

Whether used during meditation, prayer, yoga, self-care or your evening wind-down, the Health Candle transforms an ordinary moment into an intentional ritual dedicated to nurturing yourself.

Why Use:
- Create a calming and restorative atmosphere
- Support relaxation and mindfulness practices
- Set intentions around health, vitality and wellbeing
- Complement meditation, yoga and breathwork
- Create a peaceful space for prayer and reflection
- Support an intentional evening wind-down routine
- Encourage regular moments of rest and self-care
- Help you reconnect with yourself and your wellness goals

Ingredients:
Natural Wax, Essential Oils (Lavender, Sandalwood, Rosemary), Sacred Herbs (Basil Leaves, Marigold Flower), Charged Healing Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Take a few slow, deep breaths before lighting it.
3. Set an intention for your wellbeing—for example, balance, vitality, strength or inner peace.
4. Light the candle mindfully.
5. Sit comfortably and focus on the flame while allowing yourself to relax.
6. Spend 10–15 minutes in meditation, prayer, breathwork, journaling or quiet reflection.
7. You may repeat: "I honour my body, nurture my wellbeing and welcome balance, vitality and peace into my life."
8. When your ritual is complete, extinguish the candle safely.

For Meditation & Wellness:
The Health Candle can become an anchor for your daily wellness practice. Light it before meditation, yoga, breathwork or gentle stretching. Allow the flame to signal the beginning of your "me time"—a period where you consciously step away from distractions and focus on yourself.
Use this time to check in with your body and ask:
What does my body need today?
Where can I slow down?
What can I do to support my wellbeing?

When to Use It:
- In the morning as part of a mindful start
- Before meditation or yoga
- During breathwork or relaxation
- During prayer or spiritual practices
- After a tiring or stressful day
- During your evening self-care routine
- Before journaling or reflection
- Whenever you need a peaceful moment to reconnect with yourself

Create Your Ritual:
For a deeper experience, create a peaceful environment. Put your phone away, dim the lights and take a few deep breaths.
As the candle burns, focus on restoration rather than rushing.
Visualise yourself feeling balanced, energised and well.
Let the flame remind you that caring for yourself is not a luxury—it is a practice.
Pause.
Breathe.
Nurture.
Renew. ✨

The Ascension Way:
At Ascension, we believe wellbeing begins with conscious care of the body, mind and inner self.
The Ascension Health Boat Candle is an invitation to create a regular ritual of mindfulness and self-care—a quiet space where you can reconnect with your intentions and make your wellbeing a priority.
Nurture your body.
Calm your mind.
Honour your wellbeing.
Rise renewed. 🌿🕯️

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Health Candle is intended to complement personal wellness, mindfulness and spiritual practices. It is not a medicine and does not diagnose, treat, cure or prevent any disease or medical condition.`
  }
];

async function addCandles() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('MongoDB connected.');

    for (const candle of newBoatCandles) {
      const existing = await Product.findOne({ name: candle.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, { $set: candle });
        console.log(`Updated product in DB: ${candle.name}`);
      } else {
        await Product.create(candle);
        console.log(`Created product in DB: ${candle.name}`);
      }
    }

    // Update extracted_products.json
    const jsonPath = path.join(__dirname, 'extracted_products.json');
    if (fs.existsSync(jsonPath)) {
      const currentList = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      for (const candle of newBoatCandles) {
        const idx = currentList.findIndex(p => p.name === candle.name);
        if (idx !== -1) {
          currentList[idx] = candle;
        } else {
          currentList.push(candle);
        }
      }
      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      console.log('Updated extracted_products.json with Love & Peace and Health Boat Candles.');
    }

    const total = await Product.countDocuments();
    console.log(`Total products now in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error adding boat candles:', err);
    process.exit(1);
  }
}

addCandles();
