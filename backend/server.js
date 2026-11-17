const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ override: true });

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// High-performance gzip/deflate response compression (drastically cuts HTTP bandwidth)
app.use(compression({
  threshold: 1024, // Compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Morgan logger for requests
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve local uploads folder with aggressive browser caching & ETags (30 days)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '30d',
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

// Mount API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));
app.use('/api/retreats', require('./routes/retreatRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/webinars', require('./routes/webinarRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ascension by Sonali API is running smoothly.' });
});

// Serve frontend build in production if available with long-term asset caching
const frontendDist = path.join(__dirname, '../frontend/dist');
const fs = require('fs');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler Middleware
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
const { startWebinarReminderCron, startMetaAdsSyncCron } = require('./services/cronService');
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  startWebinarReminderCron();
  startMetaAdsSyncCron();
});
