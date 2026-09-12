import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  pricing: Number,
  images: [String]
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function inspect() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ascension';
  await mongoose.connect(mongoUri);

  const dbProducts = await Product.find({}).lean();
  console.log(`DB has ${dbProducts.length} products`);
  
  const categories = [...new Set(dbProducts.map(p => p.category))];
  console.log('Categories in DB:', categories);

  const candles = dbProducts.filter(p => 
    p.category.toLowerCase().includes('candle') || 
    p.name.toLowerCase().includes('candle')
  );
  console.log(`Found ${candles.length} candle products in DB:`);
  candles.forEach(c => {
    console.log(` - [${c.category}] ${c.name}: images = ${JSON.stringify(c.images)}`);
  });

  const allImages = new Set();
  dbProducts.forEach(p => {
    (p.images || []).forEach(img => allImages.add(img));
  });
  console.log(`Total unique product images across all products: ${allImages.size}`);

  await mongoose.disconnect();
}

inspect();
