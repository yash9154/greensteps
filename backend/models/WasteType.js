import pool from '../config/database.js';

export class WasteType {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM waste_types');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM waste_types WHERE waste_type_id = ?', [id]);
    return rows[0] || null;
  }
}
