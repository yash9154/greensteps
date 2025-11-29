import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { getAllUsers, getAllWaste } from '../controllers/adminController.js';
import pool from '../config/database.js';

const router = express.Router();

// Middleware to check if user is admin
const checkAdmin = async (req, res, next) => {
  try {
    const user = await pool.query('SELECT is_admin FROM users WHERE user_id = ?', [req.userId]);
    if (!user[0][0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.isAdmin = true;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/users', authenticateToken, checkAdmin, getAllUsers);
router.get('/waste', authenticateToken, checkAdmin, getAllWaste);

export default router;
