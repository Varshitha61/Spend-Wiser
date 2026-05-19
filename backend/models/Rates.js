const mongoose = require('mongoose');

const ratesSchema = new mongoose.Schema({
  rates: { type: Map, of: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rates', ratesSchema);
