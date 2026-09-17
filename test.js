const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_FzeZJBY0W4tb@ep-crimson-poetry-b3q79ay4-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in DB:", res.rows.map(r => r.table_name));

    // Try query submissions
    const subRes = await client.query('SELECT * FROM submissions LIMIT 1');
    console.log("Submissions OK.");
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await client.end();
  }
}

run();
