const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
const { readTransactionsFromExcel, writeTransactionsToExcel, initExcel, EXCEL_FILE } = require('../services/excelService');

exports.getTransactions = async (req, res) => {
  try {
    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      try {
        const transactions = await Transaction.find().sort({ date: -1 });
        return res.json(transactions);
      } catch (mongoErr) {
        console.error('MongoDB query failed, falling back to Excel:', mongoErr.message);
      }
    }
    
    // Fallback to Excel
    const transactions = readTransactionsFromExcel().sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date, walletId, currency } = req.body;

    const newTransaction = {
      id: uuidv4(),
      amount: Number(amount),
      type,
      category,
      description: description || '',
      date,
      walletId,
      currency: currency || 'INR',
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB if connected
    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const tx = new Transaction(newTransaction);
      await tx.save();
      return res.status(201).json(tx);
    } else {
      // Fallback to Excel
      const transactions = readTransactionsFromExcel();
      transactions.push(newTransaction);
      writeTransactionsToExcel(transactions);
      return res.status(201).json(newTransaction);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create transaction' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const updated = await Transaction.findOneAndUpdate(
        { id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      return res.json(updated);
    } else {
      const transactions = readTransactionsFromExcel();
      const index = transactions.findIndex(t => t.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      transactions[index] = { ...transactions[index], ...req.body, id };
      writeTransactionsToExcel(transactions);
      return res.json(transactions[index]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const result = await Transaction.findOneAndDelete({ id });
      if (!result) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      return res.json({ message: 'Transaction deleted' });
    } else {
      const transactions = readTransactionsFromExcel();
      const filtered = transactions.filter(t => t.id !== id);
      if (filtered.length === transactions.length) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      writeTransactionsToExcel(filtered);
      return res.json({ message: 'Transaction deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

exports.clearAllTransactions = async (req, res) => {
  try {
    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      await Transaction.deleteMany({});
      return res.json({ message: 'All data cleared' });
    } else {
      initExcel();
      const XLSX = require('xlsx');
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt', 'source', 'smsFrom']
      ]);
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      XLSX.writeFile(wb, EXCEL_FILE);
      return res.json({ message: 'All data cleared' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear data' });
  }
};

exports.downloadTransactions = (req, res) => {
  try {
    initExcel();
    res.download(EXCEL_FILE, 'spendwiser-transactions.xlsx');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download file' });
  }
};
