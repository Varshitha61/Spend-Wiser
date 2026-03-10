require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Transaction = require('./models/Transaction');

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to call the API

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST a new transaction (n8n or Frontend)
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, type, category, description, date, walletId, currency } = req.body;
    
    const transaction = new Transaction({
      amount, type, category, description, date, walletId, currency
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create transaction' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
