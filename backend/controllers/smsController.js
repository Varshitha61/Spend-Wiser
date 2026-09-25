const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');
const { parseBankSMS } = require('../utils/smsParser');
const { readTransactionsFromExcel, writeTransactionsToExcel } = require('../services/excelService');

exports.receiveWebhook = async (req, res) => {
  try {
    const { message, from, timestamp } = req.body;

    const parsedTx = parseBankSMS(message);

    if (!parsedTx) {
      return res.status(400).json({ error: 'Could not parse transaction from SMS' });
    }

    const newTransaction = {
      id: uuidv4(),
      amount: Number(parsedTx.amount),
      type: parsedTx.type,
      category: parsedTx.category || 'Other',
      description: parsedTx.description || 'Bank Transaction',
      date: timestamp || new Date().toISOString().split('T')[0],
      walletId: '1',
      currency: parsedTx.currency || 'INR',
      source: 'sms',
      smsFrom: from
    };

    try {
      const tx = await prisma.transaction.create({
        data: newTransaction
      });
      return res.status(201).json({ success: true, transaction: tx });
    } catch (dbErr) {
      console.error('Prisma save failed in SMS webhook, falling back to Excel:', dbErr.message);
      const transactions = readTransactionsFromExcel();
      newTransaction.createdAt = new Date().toISOString();
      transactions.push(newTransaction);
      writeTransactionsToExcel(transactions);
      return res.status(201).json({ success: true, transaction: newTransaction });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
};
