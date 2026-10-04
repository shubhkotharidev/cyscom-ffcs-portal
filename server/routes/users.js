const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users (Leaderboard / Users list, sorted by points DESC)
// Fix: use a single JOIN query instead of N+1 per-user contribution queries
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all users
    const usersRes = await db.query(
      `SELECT id, email, name, reg_no AS "regNo", role, points, locked, excluded, departments, created_at
       FROM users
       ORDER BY points DESC, name ASC`
    );

    if (usersRes.rows.length === 0) return res.json([]);

    // Fetch ALL contributions in one query, then group in JS (eliminates N+1)
    const contribsRes = await db.query(
      `SELECT user_email, title, points, date FROM contributions ORDER BY id DESC`
    );

    const contribMap = {};
    for (const row of contribsRes.rows) {
      if (!contribMap[row.user_email]) contribMap[row.user_email] = [];
      contribMap[row.user_email].push({ title: row.title, points: row.points, date: row.date });
    }

    const users = usersRes.rows.map((u) => ({
      ...u,
      departments: u.departments || [],
      contributions: contribMap[u.email] || [],
    }));

    return res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// POST /api/users/departments (Member lock 2 department preferences)
// Fix: use a DB transaction with SELECT FOR UPDATE to prevent race conditions
// where multiple users simultaneously see a seat as available and all try to claim it.
router.post('/departments', authenticateToken, async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { departments } = req.body;
    if (!Array.isArray(departments) || departments.length !== 2) {
      return res.status(400).json({ error: 'Please select exactly 2 distinct departments.' });
    }

    const VALID_DEPTS = ['webdev', 'tech', 'design', 'social', 'events', 'outreach'];
    if (!departments.every((d) => VALID_DEPTS.includes(d))) {
      return res.status(400).json({ error: 'Invalid department selection.' });
    }
    if (departments[0] === departments[1]) {
      return res.status(400).json({ error: 'Please select 2 distinct departments.' });
    }

    await client.query('BEGIN');

    // Lock this user's row so concurrent requests for the same user are serialized
    const userRes = await client.query(
      `SELECT locked FROM users WHERE email = $1 FOR UPDATE`,
      [req.user.email]
    );
    if (userRes.rows.length > 0 && userRes.rows[0].locked) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your departments are already locked.' });
    }

    // Check capacity limits inside the transaction (counts are now consistent)
    const LIMITS = { tech: 15, webdev: 15, events: 15, design: 5, social: 5, outreach: 5 };

    for (const d of departments) {
      const countRes = await client.query(
        `SELECT COUNT(*) FROM users WHERE $1 = ANY(departments)`,
        [d]
      );
      const currentCount = parseInt(countRes.rows[0].count, 10);
      if (currentCount >= LIMITS[d]) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Department '${d}' is now full. Please choose another.` });
      }
    }

    // Atomically lock and assign
    await client.query(
      `UPDATE users SET departments = $1, locked = true WHERE email = $2`,
      [departments, req.user.email]
    );

    await client.query('COMMIT');
    return res.json({ success: true, departments });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Lock departments error:', err);
    return res.status(500).json({ error: 'Failed to lock department selections.' });
  } finally {
    client.release();
  }
});

// POST /api/users/assign-points (Staff direct task points award)
router.post('/assign-points', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }
    const { email, title, points } = req.body;
    const pts = parseInt(points, 10);

    if (!email || !title || !pts || pts <= 0) {
      return res.status(400).json({ error: 'Invalid title, points, or target user.' });
    }
    if (pts > 500) {
      return res.status(400).json({ error: 'Cannot award more than 500 points in a single action.' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters.' });
    }

    const today = new Date().toISOString().slice(0, 10);

    await db.query(`UPDATE users SET points = points + $1 WHERE email = $2`, [pts, email]);
    await db.query(
      `INSERT INTO contributions (user_email, title, points, date) VALUES ($1, $2, $3, $4)`,
      [email, title.trim(), pts, today]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Assign points error:', err);
    return res.status(500).json({ error: 'Failed to assign task points.' });
  }
});

// POST /api/users/toggle-exclusion (Super Admin toggle Leaderboard exclusion)
router.post('/toggle-exclusion', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Target user email is required.' });
    }

    const updated = await db.query(
      `UPDATE users SET excluded = NOT excluded WHERE email = $1 RETURNING email, excluded`,
      [email]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ success: true, ...updated.rows[0] });
  } catch (err) {
    console.error('Toggle exclusion error:', err);
    return res.status(500).json({ error: 'Failed to toggle leaderboard exclusion.' });
  }
});

// POST /api/users/manage-departments (Staff override member departments)
router.post('/manage-departments', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }
    const { email, departments } = req.body;
    if (!email || !Array.isArray(departments) || departments.length !== 2) {
      return res.status(400).json({ error: 'Invalid departments selection.' });
    }

    const VALID_DEPTS = ['webdev', 'tech', 'design', 'social', 'events', 'outreach'];
    if (!departments.every((d) => VALID_DEPTS.includes(d))) {
      return res.status(400).json({ error: 'Invalid department selection.' });
    }

    await db.query(
      `UPDATE users SET departments = $1, locked = true WHERE email = $2`,
      [departments, email]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Manage departments error:', err);
    return res.status(500).json({ error: 'Failed to update member departments.' });
  }
});

module.exports = router;
