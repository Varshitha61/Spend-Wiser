const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

const app = express();
app.use(express.json());
app.use(cors());

// Memory cache for rates (Vercel serverless functions are ephemeral, so this might reset often)
let cachedRates = {
  'ppf': '7.1% p.a.',
  'fixed-deposit': '6.5% p.a.',
  'nps': '9.0% p.a.',
  'lic': '5.5% p.a.',
  'gold': '10.5% p.a.',
  'mutual-funds': '14.0% p.a.'
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });
}

// Schemas
const transactionSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  amount: Number,
  type: String,
  category: String,
  description: String,
  date: String,
  walletId: String,
  currency: { type: String, default: 'INR' },
  source: { type: String, default: 'manual' },
  smsFrom: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

// API Endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const tx = new Transaction({ ...req.body, id: uuidv4() });
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction' });
  }
});

app.get('/api/investment-rates/scrape', async (req, res) => {
  // Simple scraper logic for demo on Vercel
  res.json(cachedRates);
});

// Export the app for Vercel
module.exports = app;
