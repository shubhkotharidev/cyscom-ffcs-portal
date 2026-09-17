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

// GET /api/projects/requests  (Admin + SuperAdmin)
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }
    const result = await db.query(
      `SELECT pr.id, pr.project_id AS "projectId", pr.user_email AS email,
              pr.user_name AS name, pr.reg_no AS "regNo", pr.status,
              pr.requested_at AS "requestedAt", pr.reviewed_by AS "reviewedBy",
              pr.reviewed_at AS "reviewedAt",
              p.title AS "projectTitle"
       FROM project_requests pr
       JOIN projects p ON p.id = pr.project_id
       ORDER BY pr.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Fetch project requests error:', err);
    return res.status(500).json({ error: 'Failed to fetch project requests.' });
  }
});

// POST /api/projects (Create project - Super Admin)
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { dept, title, brief, seatsTotal } = req.body;
    const seats = parseInt(seatsTotal, 10);
    const cleanDept = dept ? dept.trim() : 'general';

    if (!title || !brief || !seats || seats <= 0) {
      return res.status(400).json({ error: 'Title, brief, and seat count are all required.' });
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
      [id, cleanDept, title.trim(), brief.trim(), seats]
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
    const cleanDept = dept ? dept.trim() : 'general';

    if (!title || !brief || !seats || seats <= 0) {
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
      [cleanDept, title.trim(), brief.trim(), seats, id]
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

// POST /api/projects/:id/request  (Member requests to join a project)
router.post('/:id/request', authenticateToken, async (req, res) => {
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
      return res.status(400).json({ error: 'You are already a member of this project.' });
    }

    // Check for existing pending/approved request
    const existing = await db.query(
      `SELECT id, status FROM project_requests WHERE project_id = $1 AND user_email = $2`,
      [id, email]
    );
    if (existing.rows.length > 0) {
      const s = existing.rows[0].status;
      if (s === 'pending')  return res.status(409).json({ error: 'You already have a pending request for this project.' });
      if (s === 'approved') return res.status(409).json({ error: 'Your request was already approved.' });
      // If rejected, allow re-request by deleting old one
      await db.query('DELETE FROM project_requests WHERE id = $1', [existing.rows[0].id]);
    }

    // Fetch user details for the request record
    const userRes = await db.query('SELECT name, reg_no FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User record not found.' });
    }
    const user = userRes.rows[0];

    const reqId = `pr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const today = new Date().toISOString().slice(0, 10);

    const inserted = await db.query(
      `INSERT INTO project_requests (id, project_id, user_email, user_name, reg_no, status, requested_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING id, project_id AS "projectId", user_email AS email, user_name AS name,
                 reg_no AS "regNo", status, requested_at AS "requestedAt"`,
      [reqId, id, email, user.name, user.reg_no, today]
    );

    return res.json(inserted.rows[0]);
  } catch (err) {
    console.error('Project request error:', err);
    return res.status(500).json({ error: 'Failed to submit project request.' });
  }
});

// POST /api/projects/requests/:reqId/approve  (Admin or SuperAdmin)
router.post('/requests/:reqId/approve', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }

    const { reqId } = req.params;
    const reqRes = await db.query('SELECT * FROM project_requests WHERE id = $1', [reqId]);
    if (reqRes.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const request = reqRes.rows[0];
    if (request.status !== 'pending') {
      return res.status(409).json({ error: 'This request has already been reviewed.' });
    }

    const projRes = await db.query('SELECT * FROM projects WHERE id = $1', [request.project_id]);
    if (projRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const proj = projRes.rows[0];
    if (proj.seats_filled >= proj.seats_total) {
      return res.status(400).json({ error: 'Project seats are now full. Cannot approve.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const reviewerName = req.user.name || 'Admin';

    // 1. Approve the request
    await db.query(
      `UPDATE project_requests SET status = 'approved', reviewed_by = $1, reviewed_at = $2 WHERE id = $3`,
      [reviewerName, today, reqId]
    );

    // 2. Add member to project's applicants and increment seats_filled
    await db.query(
      `UPDATE projects
       SET seats_filled = seats_filled + 1, applicants = array_append(applicants, $1)
       WHERE id = $2`,
      [request.user_email, request.project_id]
    );

    return res.json({ success: true, reqId, projectId: request.project_id });
  } catch (err) {
    console.error('Approve project request error:', err);
    return res.status(500).json({ error: 'Failed to approve project request.' });
  }
});

// POST /api/projects/requests/:reqId/reject  (Admin or SuperAdmin)
router.post('/requests/:reqId/reject', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }

    const { reqId } = req.params;
    const reqRes = await db.query('SELECT status FROM project_requests WHERE id = $1', [reqId]);
    if (reqRes.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    if (reqRes.rows[0].status !== 'pending') {
      return res.status(409).json({ error: 'This request has already been reviewed.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const reviewerName = req.user.name || 'Admin';

    await db.query(
      `UPDATE project_requests SET status = 'rejected', reviewed_by = $1, reviewed_at = $2 WHERE id = $3`,
      [reviewerName, today, reqId]
    );

    return res.json({ success: true, reqId });
  } catch (err) {
    console.error('Reject project request error:', err);
    return res.status(500).json({ error: 'Failed to reject project request.' });
  }
});

module.exports = router;
