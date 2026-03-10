const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  walletId: { type: String, required: true },
  currency: { type: String, default: 'INR' },
});

// Convert MongoDB _id to app-friendly id
transactionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
