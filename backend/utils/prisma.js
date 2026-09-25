const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Enforce valid file: protocol for SQLite database URL
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
  if (isVercel) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const bundledDbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(bundledDbPath)) {
          fs.copyFileSync(bundledDbPath, tmpDbPath);
          console.log('✅ Copied SQLite database to /tmp/dev.db for Vercel');
        }
      }
    } catch (err) {
      console.error('⚠️ Error copying SQLite db to /tmp:', err.message);
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } else {
    process.env.DATABASE_URL = `file:${path.join(__dirname, '..', 'prisma', 'dev.db')}`;
  }
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

let tablesEnsured = false;
async function ensureTablesExist() {
  if (tablesEnsured) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Transaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "amount" REAL NOT NULL,
        "type" TEXT NOT NULL,
        "category" TEXT,
        "description" TEXT,
        "date" TEXT,
        "walletId" TEXT,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "source" TEXT NOT NULL DEFAULT 'manual',
        "smsFrom" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "BankDetails" (
        "userId" TEXT NOT NULL PRIMARY KEY,
        "accounts" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Rates" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "rates" TEXT NOT NULL,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    tablesEnsured = true;
  } catch (err) {
    console.error('⚠️ Error ensuring SQLite tables exist:', err.message);
  }
}

ensureTablesExist().catch(console.error);

module.exports = prisma;
