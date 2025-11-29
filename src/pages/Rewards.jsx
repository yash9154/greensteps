import React, { useEffect, useState } from 'react';
import { rewardsAPI } from '../services/api';
import '../styles/rewards.css';

export const Rewards = () => {
  const [reward, setReward] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await rewardsAPI.getRewards();
        setReward(response.data.reward);
        setPointsHistory(response.data.pointsHistory);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) return <div className="loading">Loading rewards...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const badgeDescriptions = {
    STARTER: '🌱 Just beginning your sustainability journey',
    SUSTAINABILITY_CHAMPION: '🌿 You are a champion of sustainability',
    GREEN_HERO: '🦸 You are a green hero',
    ECO_WARRIOR: '⚔️ You are an eco-warrior',
  };

  return (
    <div className="rewards-container">
      <h1>🏆 Your Rewards</h1>

      <div className="reward-card-main">
        <div className="reward-content">
          <h2>{reward?.badge}</h2>
          <p className="badge-description">{badgeDescriptions[reward?.badge]}</p>
          <p className="points-display">{reward?.points} Points</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((reward?.points / 100) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="progress-text">
            {100 - reward?.points} points to ECO_WARRIOR
          </p>
        </div>
      </div>

      <div className="points-history">
        <h3>Points History</h3>
        {pointsHistory && pointsHistory.length > 0 ? (
          <ul className="history-list">
            {pointsHistory.map((entry, idx) => (
              <li key={idx} className={entry.change > 0 ? 'positive' : 'negative'}>
                <span className="reason">{entry.reason}</span>
                <span className={`points ${entry.change > 0 ? 'gain' : 'loss'}`}>
                  {entry.change > 0 ? '+' : ''}{entry.change} pts
                </span>
                <span className="date">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No points history yet</p>
        )}
      </div>

      <div className="badges-info">
        <h3>Badge Milestones</h3>
        <div className="badges-grid">
          <div className="badge-item">
            <span>🌱 STARTER</span>
            <small>0 points</small>
          </div>
          <div className="badge-item">
            <span>🌿 SUSTAINABILITY CHAMPION</span>
            <small>25 points</small>
          </div>
          <div className="badge-item">
            <span>🦸 GREEN HERO</span>
            <small>50 points</small>
          </div>
          <div className="badge-item">
            <span>⚔️ ECO WARRIOR</span>
            <small>100 points</small>
          </div>
        </div>
      </div>
    </div>
  );
};
