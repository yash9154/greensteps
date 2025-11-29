import pool from '../config/database.js';

export class WasteRecord {
  static async create(userId, entryDate, wasteTypeId, quantity, notes = '') {
    const [result] = await pool.query(
      'INSERT INTO waste_records (user_id, entry_date, waste_type_id, quantity, notes) VALUES (?, ?, ?, ?, ?)',
      [userId, entryDate, wasteTypeId, quantity, notes]
    );
    return result.insertId;
  }

  static async findByUserId(userId, limit = 100, offset = 0) {
    const [rows] = await pool.query(
      `SELECT wr.record_id, wr.user_id, wr.entry_date, wr.waste_type_id, 
              wt.display_name, wt.unit, wr.quantity, wr.notes, wr.created_at
       FROM waste_records wr
       JOIN waste_types wt ON wr.waste_type_id = wt.waste_type_id
       WHERE wr.user_id = ?
       ORDER BY wr.entry_date DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async findById(recordId, userId) {
    const [rows] = await pool.query(
      `SELECT wr.record_id, wr.user_id, wr.entry_date, wr.waste_type_id, 
              wt.display_name, wt.unit, wr.quantity, wr.notes, wr.created_at
       FROM waste_records wr
       JOIN waste_types wt ON wr.waste_type_id = wt.waste_type_id
       WHERE wr.record_id = ? AND wr.user_id = ?`,
      [recordId, userId]
    );
    return rows[0] || null;
  }

  static async update(recordId, userId, entryDate, wasteTypeId, quantity, notes) {
    const [result] = await pool.query(
      'UPDATE waste_records SET entry_date = ?, waste_type_id = ?, quantity = ?, notes = ? WHERE record_id = ? AND user_id = ?',
      [entryDate, wasteTypeId, quantity, notes, recordId, userId]
    );
    return result.affectedRows > 0;
  }

  static async delete(recordId, userId) {
    const [result] = await pool.query(
      'DELETE FROM waste_records WHERE record_id = ? AND user_id = ?',
      [recordId, userId]
    );
    return result.affectedRows > 0;
  }

  static async getAll(limit = 100, offset = 0) {
    const [rows] = await pool.query(
      `SELECT wr.record_id, wr.user_id, u.name, wr.entry_date, wr.waste_type_id, 
              wt.display_name, wt.unit, wr.quantity, wr.notes, wr.created_at
       FROM waste_records wr
       JOIN users u ON wr.user_id = u.user_id
       JOIN waste_types wt ON wr.waste_type_id = wt.waste_type_id
       ORDER BY wr.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  static async getTotalWasteByUser(userId) {
    const [rows] = await pool.query(
      'SELECT SUM(quantity) as total FROM waste_records WHERE user_id = ?',
      [userId]
    );
    return rows[0]?.total || 0;
  }

  static async getWasteByTypeForUser(userId) {
    const [rows] = await pool.query(
      `SELECT wt.display_name, SUM(wr.quantity) as total
       FROM waste_records wr
       JOIN waste_types wt ON wr.waste_type_id = wt.waste_type_id
       WHERE wr.user_id = ?
       GROUP BY wr.waste_type_id`,
      [userId]
    );
    return rows;
  }

  static async getWeeklyProgressForUser(userId) {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(entry_date, '%Y-%m-%d') as date, SUM(quantity) as daily_total
       FROM waste_records
       WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE_FORMAT(entry_date, '%Y-%m-%d')
       ORDER BY entry_date`,
      [userId]
    );
    return rows;
  }
}
