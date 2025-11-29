import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  addWaste,
  getWasteList,
  updateWaste,
  deleteWaste,
  getWasteTypes,
} from '../controllers/wasteController.js';

const router = express.Router();

router.post('/add', authenticateToken, addWaste);
router.get('/list', authenticateToken, getWasteList);
router.get('/types', authenticateToken, getWasteTypes);
router.put('/:recordId', authenticateToken, updateWaste);
router.delete('/:recordId', authenticateToken, deleteWaste);

export default router;
