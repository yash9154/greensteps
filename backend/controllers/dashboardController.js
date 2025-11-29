import { WasteRecord } from '../models/WasteRecord.js';
import { Reward } from '../models/Reward.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get total waste
    const totalWaste = await WasteRecord.getTotalWasteByUser(userId);

    // Get waste by type
    const wasteByType = await WasteRecord.getWasteByTypeForUser(userId);

    // Get weekly progress
    const weeklyProgress = await WasteRecord.getWeeklyProgressForUser(userId);

    // Get rewards
    const reward = await Reward.findByUserId(userId);

    res.status(200).json({
      totalWaste: totalWaste || 0,
      wasteByType,
      weeklyProgress,
      reward: {
        points: reward?.points || 0,
        badge: reward?.badge || 'STARTER',
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    // Get all waste records
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const allRecords = await WasteRecord.getAll(limit, offset);

    // Get all rewards
    const allRewards = await Reward.getAllRewards();

    res.status(200).json({
      wasteRecords: allRecords,
      rewards: allRewards,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportWasteCsv = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const records = await WasteRecord.getAll(limit, 0);

    let csv = 'Record ID,User,Entry Date,Waste Type,Quantity,Unit,Notes,Created At\n';

    records.forEach((record) => {
      csv += `${record.record_id},"${record.name}",${record.entry_date},${record.display_name},${record.quantity},${record.unit},"${record.notes || ''}",${record.created_at}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=waste_records.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
