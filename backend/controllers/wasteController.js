import { WasteRecord } from '../models/WasteRecord.js';
import { WasteType } from '../models/WasteType.js';
import { Reward } from '../models/Reward.js';
import { validateWasteEntry } from '../utils/validators.js';

export const addWaste = async (req, res) => {
  try {
    const userId = req.userId;
    const { entry_date, waste_type_id, quantity, notes } = req.body;

    if (!validateWasteEntry({ entry_date, waste_type_id, quantity })) {
      return res.status(400).json({ error: 'Invalid waste entry data' });
    }

    // Verify waste type exists
    const wasteType = await WasteType.findById(waste_type_id);
    if (!wasteType) {
      return res.status(400).json({ error: 'Invalid waste type' });
    }

    const recordId = await WasteRecord.create(
      userId,
      entry_date,
      waste_type_id,
      quantity,
      notes || ''
    );

    // Points logic: 2 points per kg, round to nearest integer
    const qty = Number.parseFloat(quantity) || 0;
    const points = Math.round(qty * 2);

    let rewardResult = null;
    try {
      // Ensure reward row exists for user
      await Reward.initializeReward(userId);
      if (points > 0) {
        rewardResult = await Reward.awardPoints(userId, points, `Waste entry #${recordId}`);
      }
    } catch (err) {
      console.error('Reward awarding error:', err);
      // Do not fail the waste creation if reward awarding fails; just log it
    }

    res.status(201).json({
      message: 'Waste entry added successfully',
      recordId,
      pointsAwarded: points,
      reward: rewardResult,
    });
  } catch (error) {
    console.error('Add waste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWasteList = async (req, res) => {
  try {
    const userId = req.userId;
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const records = await WasteRecord.findByUserId(userId, limit, offset);

    res.status(200).json({
      records,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get waste list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWaste = async (req, res) => {
  try {
    const userId = req.userId;
    const { recordId } = req.params;
    const { entry_date, waste_type_id, quantity, notes } = req.body;

    if (!validateWasteEntry({ entry_date, waste_type_id, quantity })) {
      return res.status(400).json({ error: 'Invalid waste entry data' });
    }

    // Verify record exists and belongs to user
    const record = await WasteRecord.findById(recordId, userId);
    if (!record) {
      return res.status(404).json({ error: 'Waste record not found' });
    }

    // Verify waste type exists
    const wasteType = await WasteType.findById(waste_type_id);
    if (!wasteType) {
      return res.status(400).json({ error: 'Invalid waste type' });
    }

    await WasteRecord.update(recordId, userId, entry_date, waste_type_id, quantity, notes || '');

    res.status(200).json({ message: 'Waste entry updated successfully' });
  } catch (error) {
    console.error('Update waste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWaste = async (req, res) => {
  try {
    const userId = req.userId;
    const { recordId } = req.params;

    // Verify record exists and belongs to user
    const record = await WasteRecord.findById(recordId, userId);
    if (!record) {
      return res.status(404).json({ error: 'Waste record not found' });
    }

    await WasteRecord.delete(recordId, userId);

    res.status(200).json({ message: 'Waste entry deleted successfully' });
  } catch (error) {
    console.error('Delete waste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWasteTypes = async (req, res) => {
  try {
    const types = await WasteType.getAll();
    res.status(200).json({ types });
  } catch (error) {
    console.error('Get waste types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
