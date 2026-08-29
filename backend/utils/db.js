const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwiser';

let connectionPromise = null;
let lastError = null;

const connectDB = async () => {
  // If already connected (readyState 1), return the connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting (readyState 2) and promise exists, await it
  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  console.log('🔄 Connecting to MongoDB...');

  const options = {};
  
  // Only force IPv4 for localhost/127.0.0.1 to handle local DNS resolution quirks.
  // Do NOT force family: 4 for MongoDB Atlas (mongodb+srv://) as it might cause connection issues in serverless hosts.
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    options.family = 4;
  }

  connectionPromise = mongoose.connect(MONGODB_URI, options)
    .then((conn) => {
      console.log('✅ MongoDB connected successfully');
      lastError = null; // Clear any previous errors
      return conn;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      lastError = err; // Store error for reporting
      connectionPromise = null; // Reset promise so a retry can occur next time
      throw err;
    });

  return connectionPromise;
};

const getLastError = () => lastError;

module.exports = {
  connectDB,
  getLastError
};
