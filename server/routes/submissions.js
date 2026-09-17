const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/submissions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, user_email AS email, user_name AS name, reg_no AS "regNo",
              description, drive_link AS "driveLink", status,
              awarded_points AS "awardedPoints", reviewed_by AS "reviewedBy",
              reviewed_by_email AS "reviewedByEmail", submitted_at AS "submittedAt",
              reviewed_at AS "reviewedAt"
       FROM submissions
       ORDER BY id DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Fetch submissions error:', err);
    return res.status(500).json({ error: 'Failed to fetch contribution submissions.' });
  }
});

// POST /api/submissions (Member submit contribution)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { description, driveLink } = req.body;
    const email = req.user.email;

    if (!description || !description.trim() || !driveLink || !driveLink.trim()) {
      return res.status(400).json({ error: 'Description and Drive Link are both required.' });
    }

    // Length limits
    if (description.trim().length > 2000) {
      return res.status(400).json({ error: 'Description must be under 2000 characters.' });
    }
    if (driveLink.trim().length > 500) {
      return res.status(400).json({ error: 'Drive link URL is too long.' });
    }

    // Validate driveLink is an actual Google Drive / Docs URL (prevents SSRF-like abuse)
    let parsedUrl;
    try {
      parsedUrl = new URL(driveLink.trim());
    } catch {
      return res.status(400).json({ error: 'Drive link must be a valid URL.' });
    }
    const allowedHosts = ['drive.google.com', 'docs.google.com', 'sheets.google.com', 'slides.google.com'];
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      return res.status(400).json({ error: 'Drive link must be a Google Drive or Docs URL.' });
    }

    const userRes = await db.query('SELECT name, reg_no FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const user = userRes.rows[0];
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const today = new Date().toISOString().slice(0, 10);

    const inserted = await db.query(
      `INSERT INTO submissions
       (id, user_email, user_name, reg_no, description, drive_link, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
       RETURNING id, user_email AS email, user_name AS name, reg_no AS "regNo", description, drive_link AS "driveLink", status, submitted_at AS "submittedAt"`,
      [id, email, user.name, user.reg_no, description.trim(), driveLink.trim(), today]
    );

    return res.json(inserted.rows[0]);
  } catch (err) {
    console.error('Submit contribution error:', err);
    return res.status(500).json({ error: 'Failed to log contribution submission.' });
  }
});


// POST /api/submissions/:id/approve (Admin or Super Admin approve & award points)
router.post('/:id/approve', authenticateToken, async (req, res) => {
  try {
    // Allow both admin and super_admin roles
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }

    const { id } = req.params;
    const { title, points } = req.body;
    const pts = parseInt(points, 10);

    if (!title || !title.trim() || !pts || pts <= 0) {
      return res.status(400).json({ error: 'Valid title and points are required.' });
    }
    if (pts > 500) {
      return res.status(400).json({ error: 'Cannot award more than 500 points per submission.' });
    }

    const subRes = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    const sub = subRes.rows[0];

    // ── Idempotency guard: prevent double-awarding points ──
    if (sub.status === 'approved') {
      return res.status(409).json({ error: 'This submission has already been approved. Points cannot be awarded twice.' });
    }
    if (sub.status === 'rejected') {
      return res.status(409).json({ error: 'This submission has already been rejected and cannot be approved.' });
    }

    const reviewerName = req.user.name || 'Admin';
    const today = new Date().toISOString().slice(0, 10);

    // 1. Update submission status (do this first to prevent race conditions)
    await db.query(
      `UPDATE submissions
       SET status = 'approved', awarded_points = $1, reviewed_by = $2, reviewed_by_email = $3, reviewed_at = $4
       WHERE id = $5 AND status = 'pending'`,
      [pts, reviewerName, req.user.email, today, id]
    );

    // 2. Add user points
    await db.query(`UPDATE users SET points = points + $1 WHERE email = $2`, [pts, sub.user_email]);

    // 3. Add to user contribution history
    await db.query(
      `INSERT INTO contributions (user_email, title, points, date) VALUES ($1, $2, $3, $4)`,
      [sub.user_email, title.trim(), pts, today]
    );

    return res.json({ success: true, id, awardedPoints: pts, reviewedBy: reviewerName });
  } catch (err) {
    console.error('Approve submission error:', err);
    return res.status(500).json({ error: 'Failed to approve submission.' });
  }
});

// POST /api/submissions/:id/reject (Admin or Super Admin reject contribution)
router.post('/:id/reject', authenticateToken, async (req, res) => {
  try {
    // Allow both admin and super_admin roles
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }

    const { id } = req.params;

    const subRes = await db.query('SELECT status FROM submissions WHERE id = $1', [id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    if (subRes.rows[0].status !== 'pending') {
      return res.status(409).json({ error: 'Only pending submissions can be rejected.' });
    }

    const reviewerName = req.user.name || 'Admin';
    const today = new Date().toISOString().slice(0, 10);

    await db.query(
      `UPDATE submissions
       SET status = 'rejected', reviewed_by = $1, reviewed_by_email = $2, reviewed_at = $3
       WHERE id = $4 AND status = 'pending'`,
      [reviewerName, req.user.email, today, id]
    );

    return res.json({ success: true, id, reviewedBy: reviewerName });
  } catch (err) {
    console.error('Reject submission error:', err);
    return res.status(500).json({ error: 'Failed to reject submission.' });
  }
});

module.exports = router;
