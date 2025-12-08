import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/layout.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <span className="brand-icon">🌱</span>
          <h1>GreenSteps</h1>
        </div>
        <div className="header-right">
          {user ? (
            <>
              <div className="header-user-info">
                <span className="header-greeting">Welcome back{', '}</span>
                {(() => {
                  // Safely derive a first name and avoid showing '0' or other falsy placeholders
                  const rawName = user?.name ? String(user.name).trim() : '';
                  if (!rawName || rawName === '0') return null;
                  const first = rawName.split(/\s+/)[0];
                  return <span className="header-user-name">{first}</span>;
                })()}
              </div>
              {user.isAdmin ? (
                <div className="admin-badge">👑 Admin</div>
              ) : null}
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
