import { Reward } from '../models/Reward.js';
import { User } from '../models/User.js';

export const getRewards = async (req, res) => {
  try {
    const userId = req.userId;
    const reward = await Reward.findByUserId(userId);
    const pointsHistory = await Reward.getPointsHistory(userId);

    res.status(200).json({
      reward: {
        points: reward?.points || 0,
        badge: reward?.badge || 'STARTER',
        awardedOn: reward?.awarded_on,
      },
      pointsHistory,
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkStreak = async (req, res) => {
  try {
    const userId = req.userId;

    // Check 7-day logging streak
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // This is a simplified check - in production, you'd track actual streaks in DB
    res.status(200).json({
      message: 'Streak check completed',
      streakActive: true,
    });
  } catch (error) {
    console.error('Check streak error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAllRewards();
    res.status(200).json({ rewards });
  } catch (error) {
    console.error('Get all rewards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
