import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getDashboardStats();
        setStats(response.data);
        // fetch AI tips after stats load
        try {
          const tipsResp = await dashboardAPI.getTips();
          setTips(tipsResp.data.tips || []);
        } catch (tErr) {
          console.warn('Failed to load tips:', tErr?.response?.data || tErr.message || tErr);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>📊 Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Waste Tracked</h3>
          <p className="stat-value">{stats?.totalWaste || 0} kg</p>
        </div>

        <div className="stat-card reward-card">
          <h3>Reward Points</h3>
          <p className="stat-value">{stats?.reward?.points || 0} pts</p>
          <p className="badge">{stats?.reward?.badge}</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Waste by Type</h3>
          {stats?.wasteByType && stats.wasteByType.length > 0 ? (
            <ul className="waste-list">
              {stats.wasteByType.map((item) => (
                <li key={item.display_name}>
                  <span>{item.display_name}</span>
                  <span className="amount">{item.total} kg</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No waste data yet</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Weekly Progress</h3>
          {stats?.weeklyProgress && stats.weeklyProgress.length > 0 ? (
            <ul className="weekly-list">
              {stats.weeklyProgress.map((item) => (
                <li key={item.date}>
                  <span>{item.date}</span>
                  <span className="amount">{item.daily_total} kg</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No weekly data yet</p>
          )}
        </div>
        <div className="chart-container">
          <h3>Eco Tips</h3>
          {tips && tips.length > 0 ? (
            <div className="ai-tip-card">
              {tips.map((t) => (
                <p key={t} className="ai-tip-line">{t}</p>
              ))}
            </div>
          ) : (
            <p>No tips available yet. Add some waste entries to get personalized tips.</p>
          )}
        </div>
      </div>
    </div>
  );
};
