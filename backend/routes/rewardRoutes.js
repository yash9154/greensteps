import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getRewards,
  checkStreak,
  getAllRewards,
} from '../controllers/rewardController.js';

const router = express.Router();

router.get('/', authenticateToken, getRewards);
router.get('/check-streak', authenticateToken, checkStreak);
router.get('/all', authenticateToken, getAllRewards);

export default router;
