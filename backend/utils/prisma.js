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

module.exports = prisma;
