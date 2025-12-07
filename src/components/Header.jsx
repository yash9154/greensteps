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
          {user && (
            <>
              <div className="header-user-info">
                <span className="header-greeting">Welcome back,</span>
                <span className="header-user-name">{user.name.split(' ')[0]}</span>
              </div>
              {user.isAdmin && (
                <div className="admin-badge">👑 Admin</div>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
