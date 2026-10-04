const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// 1. Helmet HTTP Security Headers
const configureHelmet = () => helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://lh3.googleusercontent.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: ["'self'", "https://accounts.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// 2. CORS Whitelisting
const configureCors = () => {
  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://cyscomffcs.cyscomvit.com',
    'http://cyscomffcs.cyscomvit.com',
    'https://cyscom-ffcs-portal.vercel.app',
    'http://cyscom-ffcs-portal.vercel.app',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5173',
  ];
  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Vercel serverless, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation: Access denied'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

// 3. Rate Limiters
//
// IMPORTANT: On campus networks all students share the SAME public IP (NAT).
// 80 users × ~5 requests each = 400 requests in a short burst from one IP.
// Old limit of 100/15min was killing everyone.
//
// Fix: raise general API limit to 500/15min (still blocks real DDoS).
// Auth limiter: raised to 50/15min (one student does ~2 auth calls to log in).
// Both skip Vercel's x-forwarded-for so they key on the real origin IP.

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 500,                    // 500 req/IP/window — covers 80 students @ ~6 calls each
  standardHeaders: true,
  legacyHeaders: false,
  // On Vercel behind a proxy, trust the forwarded IP
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
  message: {
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 50,                     // 50 login attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// 4. Input Sanitizer (XSS & Special Char Cleanup)
const sanitizeInput = (req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === 'string') {
      return val.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
    }
    if (typeof val === 'object' && val !== null) {
      Object.keys(val).forEach((key) => {
        val[key] = sanitize(val[key]);
      });
    }
    return val;
  };
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
};

module.exports = {
  configureHelmet,
  configureCors,
  apiRateLimiter,
  authRateLimiter,
  sanitizeInput,
};
