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
      <nav className="nav">
        <ul>
          <li>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/add-waste" className={`nav-link ${isActive('/add-waste')}`}>
              ➕ Add Waste
            </Link>
          </li>
          <li>
            <Link to="/waste-list" className={`nav-link ${isActive('/waste-list')}`}>
              📋 My Waste
            </Link>
          </li>
          <li>
            <Link to="/rewards" className={`nav-link ${isActive('/rewards')}`}>
              🏆 Rewards
            </Link>
          </li>
          {user?.isAdmin && (
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                ⚙️ Admin Panel
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};
