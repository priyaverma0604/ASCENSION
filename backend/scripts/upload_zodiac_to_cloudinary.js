const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/Product');

const zodiacs = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces'
];

const uploadsDir = path.join(__dirname, '../uploads');
const mapPathBackend = path.join(__dirname, 'cloudinary_url_map.json');
const mapPathFrontend = path.join(__dirname, '../../frontend/src/data/cloudinaryMap.json');
const mapPathAdmin = path.join(__dirname, '../../admin/src/data/cloudinaryMap.json');

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  let urlMap = {};
  if (fs.existsSync(mapPathBackend)) {
    urlMap = JSON.parse(fs.readFileSync(mapPathBackend, 'utf8'));
  }

  for (const sign of zodiacs) {
    const filename = `${sign}_zodiac_crystal_bracelet.png`;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    console.log(`Uploading ${filename} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'ascension_by_sonali',
      public_id: `${sign}_zodiac_crystal_bracelet`,
      overwrite: true,
      invalidate: true,
      resource_type: 'image'
    });

    const secureUrl = result.secure_url;
    console.log(`[CLOUDINARY] ${sign} -> ${secureUrl}`);

    // Update map keys
    const relativePath = filename;
    const webPath = `/uploads/${filename}`;
    const uploadsPath = `uploads/${filename}`;

    urlMap[webPath] = secureUrl;
    urlMap[relativePath] = secureUrl;
    urlMap[uploadsPath] = secureUrl;

    // Update MongoDB Atlas Product
    const updated = await Product.findOneAndUpdate(
      { name: new RegExp(`Ascension ${sign} Zodiac`, 'i') },
      {
        $set: {
          image: secureUrl,
          images: [secureUrl]
        }
      },
      { new: true }
    );

    if (updated) {
      console.log(`[DB UPDATED] ${updated.name} -> ${secureUrl}`);
    } else {
      console.warn(`[DB WARNING] Product for ${sign} not found!`);
    }
  }

  // Save urlMap to all 3 mapping files
  fs.writeFileSync(mapPathBackend, JSON.stringify(urlMap, null, 2), 'utf8');
  console.log(`Updated ${mapPathBackend}`);

  if (fs.existsSync(path.dirname(mapPathFrontend))) {
    fs.writeFileSync(mapPathFrontend, JSON.stringify(urlMap, null, 2), 'utf8');
    console.log(`Updated ${mapPathFrontend}`);
  }

  if (fs.existsSync(path.dirname(mapPathAdmin))) {
    fs.writeFileSync(mapPathAdmin, JSON.stringify(urlMap, null, 2), 'utf8');
    console.log(`Updated ${mapPathAdmin}`);
  }

  await mongoose.disconnect();
  console.log('All 12 Zodiac bracelets uploaded and synced successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
