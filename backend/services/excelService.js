const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '..');
const EXCEL_FILE = path.join(DATA_DIR, 'data.xlsx');
const SHEET_NAME = 'Transactions';

// Initialize Excel file if it doesn't exist
function initExcel() {
  if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt', 'source', 'smsFrom']
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
    header: ['id', 'amount', 'type', 'category', 'description', 'date', 'walletId', 'currency', 'createdAt', 'source', 'smsFrom']
  });
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_FILE);
}

module.exports = {
  initExcel,
  readTransactionsFromExcel,
  writeTransactionsToExcel,
  EXCEL_FILE
};
