const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authRateLimiter } = require('../middleware/security');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const { SUPER_ADMIN_EMAILS } = require('../../src/lib/constants');

const router = express.Router();

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, name, regNo } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];
    const cleanRegNo = regNo ? regNo.trim() : 'N/A';

    // Enforce VIT Email Domain Restriction
    if (!cleanEmail.endsWith('@vitstudent.ac.in') && !cleanEmail.endsWith('@vit.ac.in')) {
      return res.status(400).json({ error: 'Access restricted: Only official VIT email addresses (@vitstudent.ac.in / @vit.ac.in) are permitted.' });
    }

    // Determine initial role
    const isSuperAdmin = SUPER_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(cleanEmail);
    const assignedRole = isSuperAdmin ? 'super_admin' : 'member';

    // 100% Parameterized SQL Query (Injection Safe)
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);

    let user;
    if (existing.rows.length === 0) {
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const inserted = await db.query(
        `INSERT INTO users (id, email, name, reg_no, role, points, locked, departments)
         VALUES ($1, $2, $3, $4, $5, 0, false, '{}')
         RETURNING *`,
        [id, cleanEmail, cleanName, cleanRegNo, assignedRole]
      );
      user = inserted.rows[0];
    } else {
      user = existing.rows[0];
    }

    // Issue JWT Token (expires in 7 days)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        regNo: user.reg_no,
        role: user.role,
        points: user.points,
        locked: user.locked,
        departments: user.departments || [],
      },
    });
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// POST /api/auth/staff-login (Secure Backend Password Verification)
router.post('/staff-login', authRateLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const u = username.trim().toLowerCase();
  const p = password.trim();

  // Credentials must be set in .env — no hardcoded fallbacks allowed
  const superUser = process.env.SUPERADMIN_USER ? process.env.SUPERADMIN_USER.trim().toLowerCase() : null;
  const superPass = process.env.SUPERADMIN_PASS ? process.env.SUPERADMIN_PASS.trim() : null;

  if (!superUser || !superPass) {
    console.error('CRITICAL: SUPERADMIN_USER or SUPERADMIN_PASS not set in environment variables.');
    return res.status(503).json({ error: 'Staff authentication is not configured. Contact the system administrator.' });
  }

  if (u === superUser && p === superPass) {
    const user = {
      email: 'root@vitstudent.ac.in',
      name: 'Super Admin',
      regNo: 'STAFF-001',
      role: 'super_admin',
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user });
  }

  return res.status(401).json({ error: 'Invalid staff username or password.' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = userRes.rows[0];
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        regNo: user.reg_no,
        role: user.role,
        points: user.points,
        locked: user.locked,
        departments: user.departments || [],
      },
    });
  } catch (err) {
    console.error('Auth me error:', err);
    return res.status(500).json({ error: 'Failed to retrieve session profile.' });
  }
});

module.exports = router;
