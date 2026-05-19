const fs = require('fs');
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
