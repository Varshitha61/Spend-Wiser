const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');
const utilsDir = path.join(__dirname, 'utils');

// 1. utils/paths.js
fs.writeFileSync(path.join(utilsDir, 'paths.js'), `const path = require('path');
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '..', '..');
const RATES_FILE = path.join(DATA_DIR, 'rates.json');
const EXCEL_FILE = path.join(DATA_DIR, 'data.xlsx');
module.exports = { isVercel, DATA_DIR, RATES_FILE, EXCEL_FILE };
`);

// 2. utils/excelHelper.js
fs.writeFileSync(path.join(utilsDir, 'excelHelper.js'), `const fs = require('fs');
const XLSX = require('xlsx');
const { EXCEL_FILE } = require('./paths');
const SHEET_NAME = 'Transactions';

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

module.exports = { initExcel, readTransactionsFromExcel, writeTransactionsToExcel, EXCEL_FILE, SHEET_NAME };
`);

// 3. models/Transaction.js
fs.writeFileSync(path.join(modelsDir, 'Transaction.js'), `const mongoose = require('mongoose');
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
`);

// 4. models/BankDetails.js
fs.writeFileSync(path.join(modelsDir, 'BankDetails.js'), `const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accounts: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BankDetails', bankDetailsSchema);
`);

// 5. models/User.js
fs.writeFileSync(path.join(modelsDir, 'User.js'), `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
`);

// 6. models/Rates.js
fs.writeFileSync(path.join(modelsDir, 'Rates.js'), `const mongoose = require('mongoose');

const ratesSchema = new mongoose.Schema({
  rates: { type: Map, of: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rates', ratesSchema);
`);

console.log('Successfully created initial files.');
