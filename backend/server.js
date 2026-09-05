const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logger for requests
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve local uploads folder (Static fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ascension by Sonali API is running smoothly.' });
});

// Serve frontend build in production if available
const frontendDist = path.join(__dirname, '../frontend/dist');
const fs = require('fs');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler Middleware
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
const { startWebinarReminderCron } = require('./services/cronService');
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  startWebinarReminderCron();
});
