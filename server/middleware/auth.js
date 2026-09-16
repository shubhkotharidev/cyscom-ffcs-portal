const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment variables. Server cannot start securely.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Authentication token required.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

// Require Super Admin Role Guard
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin access required.' });
  }
  next();
};

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireSuperAdmin,
};
