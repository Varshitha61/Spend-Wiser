const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  amount: Number,
  type: String, // 'income' or 'expense'
  category: String,
  description: String,
  date: String,
  walletId: String,
  currency: { type: String, default: 'INR' },
  source: { type: String, default: 'manual' }, // 'manual', 'sms', 'api'
  smsFrom: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
