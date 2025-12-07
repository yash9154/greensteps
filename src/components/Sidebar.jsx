import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/layout.css';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-icon">🌱</span>
          <span className="sidebar-title">GreenSteps</span>
        </div>
      </div>

      <nav className="nav">
        {/* Main Features */}
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <ul>
            <li>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Waste Tracking */}
        <div className="nav-section">
          <div className="nav-section-title">Waste Tracking</div>
          <ul>
            <li>
              <Link to="/add-waste" className={`nav-link ${isActive('/add-waste')}`}>
                <span className="nav-icon">➕</span>
                <span className="nav-text">Add Waste Entry</span>
              </Link>
            </li>
            <li>
              <Link to="/waste-list" className={`nav-link ${isActive('/waste-list')}`}>
                <span className="nav-icon">📋</span>
                <span className="nav-text">My Waste Records</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Gamification */}
        <div className="nav-section">
          <div className="nav-section-title">Achievements</div>
          <ul>
            <li>
              <Link to="/rewards" className={`nav-link ${isActive('/rewards')}`}>
                <span className="nav-icon">🏆</span>
                <span className="nav-text">Rewards & Leaderboard</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Section */}
        {user?.isAdmin && (
          <div className="nav-section admin-section">
            <div className="nav-section-title">Administration</div>
            <ul>
              <li>
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <div className="user-name">{user?.name?.split(' ')[0]}</div>
            <div className="user-role">{user?.isAdmin ? 'Admin' : 'Member'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
