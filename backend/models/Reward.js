import pool from '../config/database.js';

export class Reward {
  static async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM rewards WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  }

  static async initializeReward(userId) {
    const existing = await this.findByUserId(userId);
    if (!existing) {
      await pool.query(
        'INSERT INTO rewards (user_id, points, badge) VALUES (?, ?, ?)',
        [userId, 0, 'STARTER']
      );
    }
  }

  static async updatePoints(userId, points, badge = null) {
    const query = badge
      ? 'UPDATE rewards SET points = ?, badge = ?, awarded_on = CURDATE() WHERE user_id = ?'
      : 'UPDATE rewards SET points = ? WHERE user_id = ?';
    
    const params = badge
      ? [points, badge, userId]
      : [points, userId];

    await pool.query(query, params);
  }

  static async awardPoints(userId, points, reason) {
    // Record in points_history
    await pool.query(
      'INSERT INTO points_history (user_id, change, reason) VALUES (?, ?, ?)',
      [userId, points, reason]
    );

    // Update rewards
    const [rows] = await pool.query(
      'SELECT points FROM rewards WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      const newPoints = rows[0].points + points;
      let badge = 'STARTER';
      
      if (newPoints >= 100) badge = 'ECO_WARRIOR';
      else if (newPoints >= 50) badge = 'GREEN_HERO';
      else if (newPoints >= 25) badge = 'SUSTAINABILITY_CHAMPION';

      await this.updatePoints(userId, newPoints, badge);
      return { points: newPoints, badge };
    }
  }

  static async getPointsHistory(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM points_history WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async getAllRewards() {
    const [rows] = await pool.query(
      `SELECT r.reward_id, u.name, r.points, r.badge, r.awarded_on
       FROM rewards r
       JOIN users u ON r.user_id = u.user_id
       ORDER BY r.points DESC`
    );
    return rows;
  }
}
