const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accounts: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BankDetails', bankDetailsSchema);
