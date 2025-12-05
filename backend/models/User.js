import pool from '../config/database.js';

export class User {
  static async findById(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async create(name, email, passwordHash) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, false]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, is_admin, created_at FROM users'
    );
    return rows;
  }

  static async updateProfile(userId, name, email) {
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE user_id = ?',
      [name, email, userId]
    );
  }
}
