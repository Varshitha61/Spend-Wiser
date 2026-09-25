const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (isVercel) {
  try {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const bundledDbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
        console.log('✅ Copied SQLite database to /tmp/dev.db for Vercel serverless execution');
      }
    }
    
    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    }
  } catch (err) {
    console.error('⚠️ Could not set up SQLite in /tmp for Vercel:', err.message);
  }
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
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

module.exports = prisma;
