const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const db = require('./server/config/db');

async function test() {
  try {
    console.log("Testing Users Query...");
    const usersRes = await db.query(
      `SELECT id, email, name, reg_no AS "regNo", role, points, locked, excluded, departments, created_at
       FROM users
       ORDER BY points DESC, name ASC`
    );
    console.log("Users Query OK. Count:", usersRes.rows.length);
  } catch (e) {
    console.error("Users Query Error:", e);
  }

  try {
    console.log("Testing Projects Query...");
    const projectsRes = await db.query(
      `SELECT id, dept, title, brief, seats_total AS "seatsTotal", seats_filled AS "seatsFilled", applicants
       FROM projects
       ORDER BY created_at DESC`
    );
    console.log("Projects Query OK. Count:", projectsRes.rows.length);
  } catch (e) {
    console.error("Projects Query Error:", e);
  }

  try {
    console.log("Testing Submissions Query...");
    const submissionsRes = await db.query(
      `SELECT id, user_email AS email, user_name AS name, reg_no AS "regNo",
              description, drive_link AS "driveLink", status,
              awarded_points AS "awardedPoints", reviewed_by AS "reviewedBy",
              reviewed_by_email AS "reviewedByEmail", submitted_at AS "submittedAt",
              reviewed_at AS "reviewedAt"
       FROM submissions
       ORDER BY id DESC`
    );
    console.log("Submissions Query OK. Count:", submissionsRes.rows.length);
  } catch (e) {
    console.error("Submissions Query Error:", e);
  }
  process.exit();
}
test();
