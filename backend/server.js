require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

const app = express();
app.use(express.json());
app.use(cors());

const RATES_FILE = path.join(__dirname, 'rates.json');

// Memory cache for rates
let cachedRates = {
  'ppf': '7.1% p.a.',
  'fixed-deposit': '6.5% p.a.',
  'nps': '9.0% p.a.',
  'lic': '5.5% p.a.',
  'gold': '10.5% p.a.',
  'mutual-funds': '14.0% p.a.'
};

// Load cached rates from file on startup
if (fs.existsSync(RATES_FILE)) {
  try {
    const fileRates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
    cachedRates = { ...cachedRates, ...fileRates };
  } catch (e) {
    console.log('Could not read rates fallback file');
  }
}

// Function to perform the scraping
const performScraping = async () => {
  console.log('🔄 Running background scraper for investment rates...');
  try {
    const response = await axios.get('https://cleartax.in/s/ppf-public-provident-fund', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const text = $('body').text();
    
    const rateMatch = text.match(/interest rate.*?(\d\.\d)%/i);
    if (rateMatch) {
       cachedRates['ppf'] = `${rateMatch[1]}% p.a. (Live)`;
    }

    // Save to fallback file
    fs.writeFileSync(RATES_FILE, JSON.stringify(cachedRates));
    console.log('✅ Background scraper completed successfully. Rates updated.');
  } catch (e) {
    console.log('⚠️ Scraping failed in background cron. Using previously cached rates.');
  }
};

// Schedule job to run at 00:00 on day 1 of every 2nd month (every two months)
cron.schedule('0 0 1 */2 *', () => {
  performScraping();
});

// Run once on initial server startup
performScraping();

// Fast Endpoint: Fetch cached Live Government Interest Rates instantly
app.get('/api/investment-rates/scrape', (req, res) => {
  res.json(cachedRates);
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwiser';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Falling back to Excel storage for transactions');
});

// MongoDB Schemas
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

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accountHolder: String,
  accountNumber: { type: String, required: true }, // Encrypted in production
  ifscCode: String,
  bankName: String,
  accountType: String,
  mobileNumber: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true }, // In production, use bcrypt
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);
const User = mongoose.model('User', userSchema);

const EXCEL_FILE = path.join(__dirname, 'data.xlsx');
const SHEET_NAME = 'Transactions';

// Initialize Excel file if it doesn't exist
function initExcel() {
  if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, EXCEL_FILE);
  }
}

function readTransactionsFromExcel() {
  initExcel();
  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets[SHEET_NAME];
  return XLSX.utils.sheet_to_json(ws);
}

function writeTransactionsToExcel(transactions) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(transactions, {
    header: ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt']
  });
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_FILE);
}

// GET all transactions (from MongoDB if connected, else Excel)
app.get('/api/transactions', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const transactions = await Transaction.find().sort({ date: -1 });
      res.json(transactions);
    } else {
      const transactions = readTransactionsFromExcel().sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      res.json(transactions);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST a new transaction
app.post('/api/transactions', async (req, res) => {
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
    if (mongoose.connection.readyState === 1) {
      const tx = new Transaction(newTransaction);
      await tx.save();
      res.status(201).json(tx);
    } else {
      // Fallback to Excel
      const transactions = readTransactionsFromExcel();
      transactions.push(newTransaction);
      writeTransactionsToExcel(transactions);
      res.status(201).json(newTransaction);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create transaction' });
  }
});

// DELETE a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const result = await Transaction.findOneAndDelete({ id });
      if (!result) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json({ message: 'Transaction deleted' });
    } else {
      const transactions = readTransactionsFromExcel();
      const filtered = transactions.filter(t => t.id !== id);
      if (filtered.length === transactions.length) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      writeTransactionsToExcel(filtered);
      res.json({ message: 'Transaction deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// PUT update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const updated = await Transaction.findOneAndUpdate(
        { id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(updated);
    } else {
      const transactions = readTransactionsFromExcel();
      const index = transactions.findIndex(t => t.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      transactions[index] = { ...transactions[index], ...req.body, id };
      writeTransactionsToExcel(transactions);
      res.json(transactions[index]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE all transactions (Clear Data)
app.delete('/api/data/clear', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Transaction.deleteMany({});
      res.json({ message: 'All data cleared' });
    } else {
      initExcel();
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt']
      ]);
      XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
      XLSX.writeFile(wb, EXCEL_FILE);
      res.json({ message: 'All data cleared' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear data' });
  }
});

// GET bank details
app.get('/api/bank-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const bankDetails = await BankDetails.findOne({ userId });
      if (!bankDetails) {
        return res.status(404).json({ error: 'Bank details not found' });
      }
      res.json(bankDetails);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
});

// POST/UPDATE bank details
app.post('/api/bank-details', async (req, res) => {
  try {
    const { userId, accountHolder, accountNumber, ifscCode, bankName, accountType, mobileNumber, email } = req.body;

    if (!userId || !accountNumber) {
      return res.status(400).json({ error: 'userId and accountNumber are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const bankDetails = await BankDetails.findOneAndUpdate(
        { userId },
        {
          userId,
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          accountType,
          mobileNumber,
          email,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      res.status(201).json(bankDetails);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
});

// DELETE bank details
app.delete('/api/bank-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const result = await BankDetails.findOneAndDelete({ userId });
      if (!result) {
        return res.status(404).json({ error: 'Bank details not found' });
      }
      res.json({ message: 'Bank details deleted' });
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bank details' });
  }
});

// ============ USER AUTHENTICATION ENDPOINTS ============

// POST register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (mongoose.connection.readyState === 1) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const newUser = new User({
        id: uuidv4(),
        email: email.toLowerCase(),
        password, // In production, use bcrypt to hash password
        name,
      });

      await newUser.save();

      // Return user without password
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      res.status(201).json(userResponse);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      // Find user by email and password
      const user = await User.findOne({
        email: email.toLowerCase(),
        password,
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Return user without password
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.status(200).json(userResponse);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET user by ID
app.get('/api/auth/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user without password
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.json(userResponse);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT update user profile
app.put('/api/auth/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updateData = {};
      if (name) updateData.name = name;
      if (password) updateData.password = password; // In production, hash this

      const user = await User.findOneAndUpdate(
        { id: userId },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user without password
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.json(userResponse);
    } else {
      res.status(503).json({ error: 'MongoDB not connected' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// POST receive SMS webhook from bank/Twilio
app.post('/api/sms/webhook', async (req, res) => {
  try {
    const { message, from, timestamp } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

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
      createdAt: new Date().toISOString(),
      source: 'sms',
      smsFrom: from
    };

    if (mongoose.connection.readyState === 1) {
      const tx = new Transaction(newTransaction);
      await tx.save();
      res.status(201).json({ success: true, transaction: tx });
    } else {
      const transactions = readTransactionsFromExcel();
      transactions.push(newTransaction);
      writeTransactionsToExcel(transactions);
      res.status(201).json({ success: true, transaction: newTransaction });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
});

// GET download the Excel file
app.get('/api/transactions/download', (req, res) => {
  try {
    initExcel();
    res.download(EXCEL_FILE, 'spendwiser-transactions.xlsx');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

function parseBankSMS(message) {
  const patterns = [
    /(?:Paid|Received)\s+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:Debit|Credit)\s+(?:of\s+)?(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(?:from|to)\s+(\w+)/i,
    /Amount\s+(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(debited|credited)/i,
    /(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(debit|credit)/i,
  ];

  let amount = null;
  let type = null;
  const lowerMsg = message.toLowerCase();

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      if (lowerMsg.includes('paid') || lowerMsg.includes('debited') || lowerMsg.includes('debit') || lowerMsg.includes('sent')) {
        type = 'expense';
      } else if (lowerMsg.includes('received') || lowerMsg.includes('credited') || lowerMsg.includes('credit')) {
        type = 'income';
      } else {
        type = 'expense'; // default fallback for safety
      }
      break;
    }
  }

  if (!amount) return null;

  let description = 'Bank Transaction';
  const merchantMatch = message.match(/(?:at|from|to)\s+([A-Za-z\s]+?)(?:\.|,|$|via|on)/i);
  if (merchantMatch) {
    description = merchantMatch[1].trim();
  }
  
  if (lowerMsg.includes('gpay') || lowerMsg.includes('google pay')) {
    description += ' via GPay';
  } else if (lowerMsg.includes('phonepe')) {
    description += ' via PhonePe';
  } else if (lowerMsg.includes('paytm')) {
    description += ' via Paytm';
  }

  let category = 'Other';
  
  if (lowerMsg.includes('food') || lowerMsg.includes('restaurant') || lowerMsg.includes('cafe')) category = 'Food';
  else if (lowerMsg.includes('fuel') || lowerMsg.includes('petrol') || lowerMsg.includes('auto')) category = 'Transport';
  else if (lowerMsg.includes('rent') || lowerMsg.includes('housing')) category = 'Housing';
  else if (lowerMsg.includes('movie') || lowerMsg.includes('entertainment')) category = 'Entertainment';
  else if (lowerMsg.includes('shopping') || lowerMsg.includes('mall')) category = 'Shopping';
  else if (lowerMsg.includes('hospital') || lowerMsg.includes('medical') || lowerMsg.includes('pharmacy')) category = 'Health';
  else if (lowerMsg.includes('salary') || lowerMsg.includes('credited')) category = type === 'income' ? 'Salary' : 'Other';

  return {
    amount,
    type,
    description,
    category,
    currency: 'INR'
  };
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Excel backup stored at: ${EXCEL_FILE}`);
  console.log(`🔗 MongoDB URI: ${MONGODB_URI}`);
});
