import { User } from '../models/User.js';
import { WasteRecord } from '../models/WasteRecord.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllWaste = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const records = await WasteRecord.getAll(limit, offset);
    res.status(200).json({ records });
  } catch (error) {
    console.error('Get all waste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
