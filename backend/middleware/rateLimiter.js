const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

/**
 * Login rate limiter (stricter)
 * Limits: 5 attempts per 15 minutes
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,  // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Registration rate limiter
 * Limits: 3 registrations per hour
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,  // 3 registrations per hour
  message: 'Too many registrations, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * SMS webhook rate limiter
 * Limits: 50 SMS per hour
 */
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 50,  // 50 SMS per hour
  message: 'Too many SMS requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  smsLimiter
};
