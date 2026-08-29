const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '..');
const RATES_FILE = path.join(DATA_DIR, 'rates.json');

// Memory cache for rates
let cachedRates = {
  'ppf': '7.1% p.a.',
  'fixed-deposit': '6.5% p.a.',
  'nps': '9.0% p.a.',
  'lic': '5.5% p.a.',
  'gold': '10.5% p.a.',
  'mutual-funds': '14.0% p.a.'
};

function loadCachedRates() {
  if (fs.existsSync(RATES_FILE)) {
    try {
      const fileRates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
      cachedRates = { ...cachedRates, ...fileRates };
    } catch (e) {
      console.log('Could not read rates fallback file');
    }
  }
  return cachedRates;
}

async function loadRatesFromDB() {
  if (mongoose.models.Rates) {
    try {
      const dbRates = await mongoose.models.Rates.findOne();
      if (dbRates && dbRates.rates) {
        cachedRates = { ...cachedRates, ...Object.fromEntries(dbRates.rates) };
        console.log('✅ Loaded rates from MongoDB');
      }
    } catch (err) {
      console.log('⚠️ Could not load rates from MongoDB');
    }
  }
}

// Function to perform the scraping
const performScraping = async () => {
  console.log('🔄 Running background scraper for investment rates...');
  try {
    const response = await axios.get('https://cleartax.in/s/ppf', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    const text = $('body').text();
    
    const rateMatch = text.match(/interest rate.*?(\d\.\d)%/i);
    if (rateMatch) {
       cachedRates['ppf'] = `${rateMatch[1]}% p.a. (Live)`;
    }

    // Save to fallback file
    fs.writeFileSync(RATES_FILE, JSON.stringify(cachedRates));
    
    // Save to MongoDB if connected and schema exists
    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) && mongoose.models.Rates) {
      try {
        await mongoose.models.Rates.findOneAndUpdate({}, { rates: cachedRates, updatedAt: new Date() }, { upsert: true });
      } catch (err) {
        console.log('⚠️ Could not save rates to MongoDB:', err.message);
      }
    }
    console.log('✅ Background scraper completed successfully. Rates updated.');
  } catch (e) {
    console.log('⚠️ Scraping failed in background cron. Using previously cached rates.');
  }
};

const getCachedRates = () => cachedRates;

module.exports = {
  loadCachedRates,
  loadRatesFromDB,
  performScraping,
  getCachedRates
};
