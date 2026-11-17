const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const Product = require('../models/Product');
const Program = require('../models/Program');
const Workshop = require('../models/Workshop');
const Webinar = require('../models/Webinar');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const CommunityPost = require('../models/CommunityPost');

if (!isCloudinaryConfigured) {
  console.error('ERROR: Cloudinary is not properly configured in backend/.env');
  process.exit(1);
}

const uploadsDir = path.join(__dirname, '../uploads');
const mapFilePath = path.join(__dirname, 'cloudinary_url_map.json');

// Load existing mapping if present to avoid re-uploading
let urlMap = {};
if (fs.existsSync(mapFilePath)) {
  try {
    urlMap = JSON.parse(fs.readFileSync(mapFilePath, 'utf-8'));
    console.log(`Loaded ${Object.keys(urlMap).length} existing mapped URLs from cache.`);
  } catch (e) {
    urlMap = {};
  }
}

// Collect all image files in uploads directory
const collectFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectFiles(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
};

// Upload single file with retry
const uploadToCloudinary = async (filePath) => {
  const relativePath = path.relative(uploadsDir, filePath).replace(/\\/g, '/');
  const webPath = `/uploads/${relativePath}`;
  
  if (urlMap[webPath]) {
    return urlMap[webPath];
  }

  const folderPath = path.dirname(relativePath) === '.' ? 'ascension_by_sonali' : `ascension_by_sonali/${path.dirname(relativePath)}`;
  const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderPath,
      public_id: fileNameWithoutExt,
      overwrite: true,
      resource_type: 'image'
    });
    
    // Save secure URL
    urlMap[webPath] = result.secure_url;
    // Also save variations for robust matching
    urlMap[relativePath] = result.secure_url;
    urlMap[`uploads/${relativePath}`] = result.secure_url;

    console.log(`[UPLOADED] ${relativePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`[ERROR] Failed to upload ${relativePath}:`, err.message);
    return null;
  }
};

const runMigration = async () => {
  console.log('--- STARTING CLOUDINARY MIGRATION ---');
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected successfully.');

  // Test Cloudinary ping
  const ping = await cloudinary.api.ping();
  console.log('Cloudinary Ping:', ping);

  const allFiles = collectFiles(uploadsDir);
  console.log(`Found ${allFiles.length} image files to process in backend/uploads.`);

  let uploadedCount = 0;
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const res = await uploadToCloudinary(file);
    if (res) uploadedCount++;
    
    // Save map periodically
    if (uploadedCount % 10 === 0) {
      fs.writeFileSync(mapFilePath, JSON.stringify(urlMap, null, 2), 'utf-8');
    }
  }

  // Final write of map
  fs.writeFileSync(mapFilePath, JSON.stringify(urlMap, null, 2), 'utf-8');
  console.log(`All uploads complete! Total mapped URLs: ${Object.keys(urlMap).length}`);

  // Helper to resolve URL
  const resolveUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    
    const clean = rawUrl.trim();
    if (urlMap[clean]) return urlMap[clean];

    // Try variants
    const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
    if (urlMap[withSlash]) return urlMap[withSlash];

    const withoutSlash = clean.startsWith('/') ? clean.substring(1) : clean;
    if (urlMap[withoutSlash]) return urlMap[withoutSlash];

    return rawUrl;
  };

  // 1. Update Products
  console.log('\nUpdating Products in MongoDB...');
  const products = await Product.find({});
  let productsUpdated = 0;
  for (const product of products) {
    let changed = false;
    if (product.images && Array.isArray(product.images)) {
      const newImages = product.images.map((img) => {
        const resolved = resolveUrl(img);
        if (resolved !== img) changed = true;
        return resolved;
      });
      if (changed) product.images = newImages;
    }
    if (changed) {
      await product.save();
      productsUpdated++;
    }
  }
  console.log(`Updated ${productsUpdated}/${products.length} Products.`);

  // 2. Update Programs
  console.log('\nUpdating Programs in MongoDB...');
  const programs = await Program.find({});
  let programsUpdated = 0;
  for (const program of programs) {
    let changed = false;
    if (program.images && Array.isArray(program.images)) {
      const newImages = program.images.map((img) => {
        const resolved = resolveUrl(img);
        if (resolved !== img) changed = true;
        return resolved;
      });
      if (changed) program.images = newImages;
    }
    if (changed) {
      await program.save();
      programsUpdated++;
    }
  }
  console.log(`Updated ${programsUpdated}/${programs.length} Programs.`);

  // 3. Update Workshops
  console.log('\nUpdating Workshops in MongoDB...');
  const workshops = await Workshop.find({});
  let workshopsUpdated = 0;
  for (const workshop of workshops) {
    let changed = false;
    if (workshop.image) {
      const resolved = resolveUrl(workshop.image);
      if (resolved !== workshop.image) {
        workshop.image = resolved;
        changed = true;
      }
    }
    if (changed) {
      await workshop.save();
      workshopsUpdated++;
    }
  }
  console.log(`Updated ${workshopsUpdated}/${workshops.length} Workshops.`);

  // 4. Update Webinars
  console.log('\nUpdating Webinars in MongoDB...');
  const webinars = await Webinar.find({});
  let webinarsUpdated = 0;
  for (const webinar of webinars) {
    let changed = false;
    if (webinar.coverImage) {
      const resolved = resolveUrl(webinar.coverImage);
      if (resolved !== webinar.coverImage) {
        webinar.coverImage = resolved;
        changed = true;
      }
    }
    if (webinar.upiQrCodeImage) {
      const resolved = resolveUrl(webinar.upiQrCodeImage);
      if (resolved !== webinar.upiQrCodeImage) {
        webinar.upiQrCodeImage = resolved;
        changed = true;
      }
    }
    if (changed) {
      await webinar.save();
      webinarsUpdated++;
    }
  }
  console.log(`Updated ${webinarsUpdated}/${webinars.length} Webinars.`);

  // 5. Update Services
  console.log('\nUpdating Services in MongoDB...');
  const services = await Service.find({});
  let servicesUpdated = 0;
  for (const service of services) {
    let changed = false;
    if (service.image) {
      const resolved = resolveUrl(service.image);
      if (resolved !== service.image) {
        service.image = resolved;
        changed = true;
      }
    }
    if (changed) {
      await service.save();
      servicesUpdated++;
    }
  }
  console.log(`Updated ${servicesUpdated}/${services.length} Services.`);

  // 6. Update Testimonials
  console.log('\nUpdating Testimonials in MongoDB...');
  const testimonials = await Testimonial.find({});
  let testimonialsUpdated = 0;
  for (const testimonial of testimonials) {
    let changed = false;
    if (testimonial.image) {
      const resolved = resolveUrl(testimonial.image);
      if (resolved !== testimonial.image) {
        testimonial.image = resolved;
        changed = true;
      }
    }
    if (changed) {
      await testimonial.save();
      testimonialsUpdated++;
    }
  }
  console.log(`Updated ${testimonialsUpdated}/${testimonials.length} Testimonials.`);

  console.log('\n=======================================');
  console.log('CLOUDINARY MIGRATION COMPLETED SUCCESSFULLY!');
  console.log('=======================================');
  process.exit(0);
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
