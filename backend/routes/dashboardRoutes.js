import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getDashboardStats, getAdminStats, exportWasteCsv, generateTips } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', authenticateToken, getDashboardStats);
router.get('/admin/stats', authenticateToken, getAdminStats);
router.get('/admin/export-csv', authenticateToken, exportWasteCsv);
router.get('/tips', authenticateToken, generateTips);

export default router;
