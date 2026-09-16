const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users (Leaderboard / Users list, sorted by points DESC)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usersRes = await db.query(
      `SELECT id, email, name, reg_no AS "regNo", role, points, locked, excluded, departments, created_at
       FROM users
       ORDER BY points DESC, name ASC`
    );

    // Attach contribution history to each user
    const users = await Promise.all(
      usersRes.rows.map(async (u) => {
        const contribs = await db.query(
          `SELECT title, points, date FROM contributions WHERE user_email = $1 ORDER BY id DESC`,
          [u.email]
        );
        return {
          ...u,
          departments: u.departments || [],
          contributions: contribs.rows || [],
        };
      })
    );

    return res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// POST /api/users/departments (Member lock 2 department preferences)
router.post('/departments', authenticateToken, async (req, res) => {
  try {
    const { departments } = req.body;
    if (!Array.isArray(departments) || departments.length !== 2) {
      return res.status(400).json({ error: 'Please select exactly 2 distinct departments.' });
    }

    const VALID_DEPTS = ['webdev', 'tech', 'design', 'social', 'events'];
    if (!departments.every((d) => VALID_DEPTS.includes(d))) {
      return res.status(400).json({ error: 'Invalid department selection.' });
    }
    if (departments[0] === departments[1]) {
      return res.status(400).json({ error: 'Please select 2 distinct departments.' });
    }

    await db.query(
      `UPDATE users SET departments = $1, locked = true WHERE email = $2`,
      [departments, req.user.email]
    );

    return res.json({ success: true, departments });
  } catch (err) {
    console.error('Lock departments error:', err);
    return res.status(500).json({ error: 'Failed to lock department selections.' });
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

    // Update user total points
    await db.query(`UPDATE users SET points = points + $1 WHERE email = $2`, [pts, email]);

    // Insert contribution record
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

// POST /api/users/promote (Super Admin promote / demote user role)
router.post('/promote', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email, newRole } = req.body;
    if (!email || !['member', 'admin', 'super_admin'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid email or role specified.' });
    }

    await db.query(`UPDATE users SET role = $1 WHERE email = $2`, [newRole, email]);

    return res.json({ success: true, role: newRole });
  } catch (err) {
    console.error('Promote user error:', err);
    return res.status(500).json({ error: 'Failed to update user role.' });
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

    const VALID_DEPTS = ['webdev', 'tech', 'design', 'social', 'events'];
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
