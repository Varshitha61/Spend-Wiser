const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/prisma');
const { readTransactionsFromExcel, writeTransactionsToExcel } = require('../services/excelService');

exports.getBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    try {
      const bankDetails = await prisma.bankDetails.findUnique({
        where: { userId }
      });
      if (!bankDetails) {
        return res.status(404).json({ error: 'Bank details not found' });
      }
      const accounts = typeof bankDetails.accounts === 'string' ? JSON.parse(bankDetails.accounts) : bankDetails.accounts;
      return res.json({ ...bankDetails, accounts });
    } catch (dbErr) {
      console.error('Prisma query failed:', dbErr.message);
      return res.status(503).json({ error: 'Database error' });
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

    try {
      const hasBankTransactions = await prisma.transaction.findFirst({
        where: { source: 'bank_sync' }
      });

      const accountsStr = typeof accounts === 'string' ? accounts : JSON.stringify(accounts);

      const bankDetails = await prisma.bankDetails.upsert({
        where: { userId },
        update: { accounts: accountsStr },
        create: { userId, accounts: accountsStr }
      });

      if (!hasBankTransactions && accounts.length > 0) {
        await prisma.transaction.createMany({
          data: mockTransactions
        });
      }

      const returnedAccounts = typeof bankDetails.accounts === 'string' ? JSON.parse(bankDetails.accounts) : bankDetails.accounts;
      return res.status(201).json({ ...bankDetails, accounts: returnedAccounts });
    } catch (mongoErr) {
      console.error('Prisma operation failed in bank-details:', mongoErr.message);
      
      const excelTransactions = readTransactionsFromExcel();
      const hasBankTxInExcel = excelTransactions.some(t => t.source === 'bank_sync');
      
      if (!hasBankTxInExcel && accounts.length > 0) {
        excelTransactions.push(...mockTransactions);
        writeTransactionsToExcel(excelTransactions);
      }
      
      return res.status(201).json({ 
        userId, accounts 
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
};

exports.deleteBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    try {
      await prisma.bankDetails.delete({
        where: { userId }
      });
      return res.json({ message: 'Bank details deleted' });
    } catch (dbErr) {
      console.error('Prisma query failed:', dbErr.message);
      if (dbErr.code === 'P2025') {
         return res.status(404).json({ error: 'Bank details not found' });
      }
      return res.status(503).json({ error: 'Database error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bank details' });
  }
};
