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

    console.log(`Reward.updatePoints: userId=${userId}, points=${points}, badge=${badge}`);
    await pool.query(query, params);
  }

  static async awardPoints(userId, points, reason) {
    // Record in points_history
    console.log(`Reward.awardPoints: awarding ${points} to user ${userId} for reason: ${reason}`);
    let insertResult;
    const enablePointsHistory = !(process.env.ENABLE_POINTS_HISTORY === 'false' || process.env.ENABLE_POINTS_HISTORY === '0');
    if (!enablePointsHistory) {
      console.log('Reward.awardPoints: ENABLE_POINTS_HISTORY is false -> skipping insert into points_history');
    }
    // Detect which column name exists in points_history to store the points change
    const candidates = ['points_change', 'change', 'points'];
    const [colRows] = await pool.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'points_history' AND COLUMN_NAME IN (?, ?, ?)`,
      candidates
    );

    let pointsCol = null;
    if (colRows && colRows.length > 0) {
      pointsCol = colRows[0].COLUMN_NAME;
      console.log('Reward.awardPoints: detected points column in points_history:', pointsCol);
    } else {
      console.warn('Reward.awardPoints: no known points column found in points_history; falling back to trying known names');
    }

    let inserted = false;
    if (enablePointsHistory) {
      if (pointsCol) {
        // Use detected column
        const sql = `INSERT INTO points_history (user_id, \`${pointsCol}\`, reason) VALUES (?, ?, ?)`;
        try {
          insertResult = await pool.query(sql, [userId, points, reason]);
          console.log('Reward.awardPoints: points_history insert succeeded with detected column:', pointsCol);
          inserted = true;
        } catch (e) {
          console.warn('Reward.awardPoints: insert with detected column failed:', pointsCol, e.code);
        }
      }

      if (!inserted) {
        // Fallback attempts (older code) — try explicitly known names
        const insertAttempts = [
          { sql: 'INSERT INTO points_history (user_id, points_change, reason) VALUES (?, ?, ?)', params: [userId, points, reason] },
          { sql: 'INSERT INTO points_history (user_id, `change`, reason) VALUES (?, ?, ?)', params: [userId, points, reason] },
          { sql: 'INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', params: [userId, points, reason] },
        ];

        for (const attempt of insertAttempts) {
          try {
            insertResult = await pool.query(attempt.sql, attempt.params);
            console.log('Reward.awardPoints: points_history insert succeeded with SQL:', attempt.sql);
            inserted = true;
            break;
          } catch (e) {
            console.warn('Reward.awardPoints: insert attempt failed:', attempt.sql, e.code);
            if (e.code !== 'ER_BAD_FIELD_ERROR') {
              throw e;
            }
          }
        }
      }

      if (inserted === false) {
        console.error('Reward.awardPoints: failed to insert into points_history with any known column name');
      } else {
        console.log('Reward.awardPoints: points_history insert result:', insertResult[0]?.insertId || insertResult);
      }
    } else {
      // Skipped by environment toggle
      inserted = false;
    }

    // Update rewards
    const [rows] = await pool.query(
      'SELECT points FROM rewards WHERE user_id = ?',
      [userId]
    );
    console.log('Reward.awardPoints: current reward rows:', rows);

    if (rows.length > 0) {
      const current = Number(rows[0].points || 0);
      const newPoints = current + Number(points || 0);
      let badge = 'STARTER';
      
      if (newPoints >= 100) badge = 'ECO_WARRIOR';
      else if (newPoints >= 50) badge = 'GREEN_HERO';
      else if (newPoints >= 25) badge = 'SUSTAINABILITY_CHAMPION';

      await this.updatePoints(userId, newPoints, badge);
      console.log(`Reward.awardPoints: updated rewards for user ${userId} -> points=${newPoints}, badge=${badge}`);
      return { points: newPoints, badge };
    } else {
      console.warn(`Reward.awardPoints: no rewards row found for user ${userId}`);
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
