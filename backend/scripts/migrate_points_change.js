import pool from '../config/database.js';

async function run() {
  try {
    console.log('Running migration: add points_change column if missing');

    // 1) Add column if not exists (MySQL 8+ supports IF NOT EXISTS)
    await pool.query("ALTER TABLE points_history ADD COLUMN IF NOT EXISTS points_change INT DEFAULT 0");
    console.log('Ensured column points_change exists');

    // 2) Copy from `change` column if present
    try {
      await pool.query("UPDATE points_history SET points_change = `change` WHERE points_change = 0 AND `change` IS NOT NULL");
      console.log('Copied values from `change` to points_change where applicable');
    } catch (e) {
      console.log('No `change` column or update failed:', e.code || e.message);
    }

    // 3) Copy from `points` column if present
    try {
      await pool.query("UPDATE points_history SET points_change = points WHERE points_change = 0 AND points IS NOT NULL");
      console.log('Copied values from points to points_change where applicable');
    } catch (e) {
      console.log('No `points` column or update failed:', e.code || e.message);
    }

    // 4) Show a sample of recent rows
    const [rows] = await pool.query('SELECT * FROM points_history ORDER BY created_at DESC LIMIT 20');
    console.log('Recent points_history rows (after migration):');
    console.table(rows);

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
