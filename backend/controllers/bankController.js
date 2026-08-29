const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const BankDetails = require('../models/BankDetails');
const Transaction = require('../models/Transaction');
const { readTransactionsFromExcel, writeTransactionsToExcel } = require('../services/excelService');

exports.getBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const bankDetails = await BankDetails.findOne({ userId });
      if (!bankDetails) {
        return res.status(404).json({ error: 'Bank details not found' });
      }
      return res.json(bankDetails);
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
};

exports.updateBankDetails = async (req, res) => {
  try {
    const { userId, accounts } = req.body;

    const firstBankName = accounts.length > 0 ? accounts[0].bankName : 'Bank';

    const mockTransactions = [
      {
        id: uuidv4(),
        amount: 55000,
        type: 'income',
        category: 'Salary',
        description: `${firstBankName || 'Bank'} Salary Credit`,
        date: new Date().toISOString().split('T')[0],
        walletId: '1',
        currency: 'INR',
        source: 'bank_sync'
      },
      {
        id: uuidv4(),
        amount: 1500,
        type: 'expense',
        category: 'Food',
        description: `Zomato via ${firstBankName || 'Bank'}`,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        walletId: '1',
        currency: 'INR',
        source: 'bank_sync'
      },
      {
        id: uuidv4(),
        amount: 12000,
        type: 'expense',
        category: 'Housing',
        description: 'Rent Payment',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        walletId: '1',
        currency: 'INR',
        source: 'bank_sync'
      },
      {
         id: uuidv4(),
         amount: 3000,
         type: 'expense',
         category: 'Shopping',
         description: 'Amazon Purchase',
         date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
         walletId: '1',
         currency: 'INR',
         source: 'bank_sync'
      }
    ];

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      try {
        const hasBankTransactions = await Transaction.findOne({ source: 'bank_sync' });

        const bankDetails = await BankDetails.findOneAndUpdate(
          { userId },
          {
            userId,
            accounts,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );

        if (!hasBankTransactions && accounts.length > 0) {
          await Transaction.insertMany(mockTransactions);
        }

        return res.status(201).json(bankDetails);
      } catch (mongoErr) {
        console.error('MongoDB operation failed in bank-details:', mongoErr.message);
      }
    }

    const excelTransactions = readTransactionsFromExcel();
    const hasBankTxInExcel = excelTransactions.some(t => t.source === 'bank_sync');
    
    if (!hasBankTxInExcel && accounts.length > 0) {
      excelTransactions.push(...mockTransactions);
      writeTransactionsToExcel(excelTransactions);
    }
    
    return res.status(201).json({ 
      userId, accounts 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
};

exports.deleteBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const result = await BankDetails.findOneAndDelete({ userId });
      if (!result) {
        return res.status(404).json({ error: 'Bank details not found' });
      }
      return res.json({ message: 'Bank details deleted' });
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bank details' });
  }
};
