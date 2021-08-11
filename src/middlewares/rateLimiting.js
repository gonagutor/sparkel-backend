import RateLimiter from 'express-rate-limit';

export const apiLimiter = RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000,
});

export const createAccountLimiter = RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after an hour',
});
