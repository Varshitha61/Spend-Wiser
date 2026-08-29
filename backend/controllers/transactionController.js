const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/prisma');
const { readTransactionsFromExcel, writeTransactionsToExcel, initExcel, EXCEL_FILE } = require('../services/excelService');

exports.getTransactions = async (req, res) => {
  try {
    try {
      const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' }
      });
      return res.json(transactions);
    } catch (dbErr) {
      console.error('Prisma query failed, falling back to Excel:', dbErr.message);
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
    };

    try {
      const tx = await prisma.transaction.create({
        data: newTransaction
      });
      return res.status(201).json(tx);
    } catch (dbErr) {
      console.error('Prisma create failed, falling back to Excel:', dbErr.message);
      // Fallback to Excel
      const transactions = readTransactionsFromExcel();
      newTransaction.createdAt = new Date().toISOString();
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

    try {
      const updated = await prisma.transaction.update({
        where: { id },
        data: req.body,
      });
      return res.json(updated);
    } catch (dbErr) {
      console.error('Prisma update failed, falling back to Excel:', dbErr.message);
      if (dbErr.code === 'P2025') {
        return res.status(404).json({ error: 'Transaction not found' });
      }
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

    try {
      await prisma.transaction.delete({
        where: { id }
      });
      return res.json({ message: 'Transaction deleted' });
    } catch (dbErr) {
      console.error('Prisma delete failed, falling back to Excel:', dbErr.message);
      if (dbErr.code === 'P2025') {
        return res.status(404).json({ error: 'Transaction not found' });
      }
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
    try {
      await prisma.transaction.deleteMany({});
      return res.json({ message: 'All data cleared' });
    } catch (dbErr) {
      console.error('Prisma deleteMany failed, falling back to Excel:', dbErr.message);
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
