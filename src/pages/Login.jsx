import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../utils/useAuth';
import '../styles/auth.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login with:', { email });
      
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      const response = await authAPI.login({ email, password });
      console.log('✅ Login successful:', response.data);
      
      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      console.log('✅ Token saved, navigating to dashboard');
      
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      console.error('📍 Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌱 GreenSteps</h1>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};
