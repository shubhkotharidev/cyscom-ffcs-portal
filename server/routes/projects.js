const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, dept, title, brief, seats_total AS "seatsTotal", seats_filled AS "seatsFilled", applicants
       FROM projects
       ORDER BY created_at DESC`
    );
    const projects = result.rows.map((p) => ({
      ...p,
      applicants: p.applicants || [],
    }));
    return res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err);
    return res.status(500).json({ error: 'Failed to fetch projects list.' });
  }
});

// POST /api/projects (Create project - Super Admin)
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { dept, title, brief, seatsTotal } = req.body;
    const seats = parseInt(seatsTotal, 10);

    if (!dept || !title || !brief || !seats || seats <= 0) {
      return res.status(400).json({ error: 'All project fields are required.' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters.' });
    }
    if (brief.trim().length > 2000) {
      return res.status(400).json({ error: 'Brief must be under 2000 characters.' });
    }
    if (seats > 500) {
      return res.status(400).json({ error: 'Seat count cannot exceed 500.' });
    }

    const id = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const inserted = await db.query(
      `INSERT INTO projects (id, dept, title, brief, seats_total, seats_filled, applicants)
       VALUES ($1, $2, $3, $4, $5, 0, '{}')
       RETURNING id, dept, title, brief, seats_total AS "seatsTotal", seats_filled AS "seatsFilled", applicants`,
      [id, dept, title.trim(), brief.trim(), seats]
    );

    return res.json(inserted.rows[0]);
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ error: 'Failed to create new project.' });
  }
});

// PUT /api/projects/:id (Edit project - Super Admin)
router.put('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { dept, title, brief, seatsTotal } = req.body;
    const seats = parseInt(seatsTotal, 10);

    if (!dept || !title || !brief || !seats || seats <= 0) {
      return res.status(400).json({ error: 'Invalid update payload.' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters.' });
    }
    if (brief.trim().length > 2000) {
      return res.status(400).json({ error: 'Brief must be under 2000 characters.' });
    }
    if (seats > 500) {
      return res.status(400).json({ error: 'Seat count cannot exceed 500.' });
    }

    const updated = await db.query(
      `UPDATE projects
       SET dept = $1, title = $2, brief = $3, seats_total = $4
       WHERE id = $5
       RETURNING id, dept, title, brief, seats_total AS "seatsTotal", seats_filled AS "seatsFilled", applicants`,
      [dept, title.trim(), brief.trim(), seats, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id (Delete project - Super Admin)
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    return res.json({ success: true, id });
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// POST /api/projects/:id/apply (Member apply for project seat)
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user.email;

    const projRes = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const proj = projRes.rows[0];
    const applicants = proj.applicants || [];

    if (proj.seats_filled >= proj.seats_total) {
      return res.status(400).json({ error: 'Project seats are full.' });
    }

    if (applicants.includes(email)) {
      return res.status(400).json({ error: 'You have already applied for this project.' });
    }

    const updated = await db.query(
      `UPDATE projects
       SET seats_filled = seats_filled + 1, applicants = array_append(applicants, $1)
       WHERE id = $2
       RETURNING id, dept, title, brief, seats_total AS "seatsTotal", seats_filled AS "seatsFilled", applicants`,
      [email, id]
    );

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error('Apply project error:', err);
    return res.status(500).json({ error: 'Failed to register project application.' });
  }
});

module.exports = router;
