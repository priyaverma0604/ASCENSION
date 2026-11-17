const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const itemsToSeed = [
  {
    key: 'abundance',
    jarName: 'Ascension Abundance Bath Salt (Glass Jar)',
    pouchNameRegex: /abundance.*bath.*salt/i,
    localFile: path.join(__dirname, '../uploads/abundance_bath_salt_jar.jpg'),
    fallbackPath: '/uploads/abundance_bath_salt_jar.jpg'
  },
  {
    key: 'love_peace',
    jarName: 'Ascension Love & Peace Bath Salt (Glass Jar)',
    pouchNameRegex: /love.*peace.*salt/i,
    localFile: path.join(__dirname, '../uploads/love_peace_bath_salt_jar.jpg'),
    fallbackPath: '/uploads/love_peace_bath_salt_jar.jpg'
  },
  {
    key: 'cleansing',
    jarName: 'Ascension Cleansing Bath Salt (Glass Jar)',
    pouchNameRegex: /cleansing.*bath.*salt/i,
    localFile: path.join(__dirname, '../uploads/cleansing_bath_salt_jar.jpg'),
    fallbackPath: '/uploads/cleansing_bath_salt_jar.jpg'
  },
  {
    key: 'protection',
    jarName: 'Ascension Protection Bath Salt (Glass Jar)',
    pouchNameRegex: /protection.*salt/i,
    localFile: path.join(__dirname, '../uploads/protection_bath_salt_jar.jpg'),
    fallbackPath: '/uploads/protection_bath_salt_jar.jpg'
  },
  {
    key: 'health',
    jarName: 'Ascension Health Bath Salt (Glass Jar)',
    pouchNameRegex: /health.*salt/i,
    localFile: path.join(__dirname, '../uploads/health_bath_salt_jar.jpg'),
    fallbackPath: '/uploads/health_bath_salt_jar.jpg'
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas.');

    for (const item of itemsToSeed) {
      // 1. Fetch description from pouch version
      const pouchProduct = await Product.findOne({
        name: item.pouchNameRegex,
        category: 'Bath Salts'
      });

      if (!pouchProduct) {
        console.warn(`Could not find pouch product for ${item.jarName}`);
      }

      const description = pouchProduct ? pouchProduct.description : 'Premium Energized Bath Salt in an elegant Glass Jar.';

      // 2. Upload to Cloudinary if configured
      let imageUrl = item.fallbackPath;
      if (isCloudinaryConfigured && fs.existsSync(item.localFile)) {
        try {
          const uploadRes = await cloudinary.uploader.upload(item.localFile, {
            folder: 'ascension_by_sonali',
            public_id: `${item.key}_bath_salt_jar_${Date.now()}`
          });
          imageUrl = uploadRes.secure_url;
          console.log(`Uploaded ${item.jarName} to Cloudinary: ${imageUrl}`);
        } catch (uploadErr) {
          console.error(`Cloudinary upload failed for ${item.jarName}, using local fallback:`, uploadErr.message);
        }
      }

      // 3. Upsert product in MongoDB
      const updatedProduct = await Product.findOneAndUpdate(
        { name: item.jarName },
        {
          name: item.jarName,
          category: 'Bath Salts',
          pricing: 450,
          description: description,
          images: [imageUrl],
          stock: 25
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`Saved product: ${updatedProduct.name} - Price: ₹${updatedProduct.pricing} - Image: ${updatedProduct.images[0]}`);
    }

    console.log('\nAll 5 Bath Salt Glass Jars successfully uploaded and seeded into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

run();
