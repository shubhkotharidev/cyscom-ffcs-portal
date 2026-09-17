const db = require('./server/config/db');

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS project_requests (
        id VARCHAR(50) PRIMARY KEY,
        project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
        user_email VARCHAR(255) NOT NULL,
        user_name VARCHAR(100),
        reg_no VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        requested_at VARCHAR(30),
        reviewed_by VARCHAR(100),
        reviewed_at VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('project_requests table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    process.exit();
  }
})();
