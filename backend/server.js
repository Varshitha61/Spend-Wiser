require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');

// Import middleware
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Services
const { loadCachedRates, loadRatesFromDB, performScraping, getCachedRates } = require('./services/scraperService');
const { EXCEL_FILE } = require('./services/excelService');

// Import Routes
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');
const smsRoutes = require('./routes/smsRoutes');

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
};
app.use(cors(corsOptions));

// Apply general rate limiter
app.use('/api/', apiLimiter);

// Initialization: Load rates and perform scraping
loadCachedRates();

// Schedule job to run at 00:00 on day 1 of every 2nd month
cron.schedule('0 0 1 */2 *', () => {
  performScraping();
});

// Run once on initial server startup
performScraping();

// Fast Endpoint: Fetch cached Live Government Interest Rates
app.get('/api/investment-rates/scrape', (req, res) => {
  res.json(getCachedRates());
});

const { connectDB } = require('./utils/db');

// Database connection middleware for all API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Catch error to allow controllers to use fallback Excel storage if appropriate
  }
  next();
});

// MongoDB Connection (starts async at boot time)
connectDB().then(async () => {
  await loadRatesFromDB();
}).catch(err => {
  console.error('⚠️ MongoDB initial connection failed:', err.message);
});

// Register API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bank-details', bankRoutes);
app.use('/api/sms', smsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Excel backup stored at: ${EXCEL_FILE}`);
    console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwiser'}`);
  });
}

module.exports = app;
