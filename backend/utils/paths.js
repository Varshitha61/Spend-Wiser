const path = require('path');
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '..', '..');
const RATES_FILE = path.join(DATA_DIR, 'rates.json');
const EXCEL_FILE = path.join(DATA_DIR, 'data.xlsx');
module.exports = { isVercel, DATA_DIR, RATES_FILE, EXCEL_FILE };
