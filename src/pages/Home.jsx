import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/home.css';

export const Home = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-navbar" style={{ backgroundColor: `rgba(46, 125, 50, ${0.9 + scrollPos / 500})` }}>
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">🌱</span>
            <span className="brand-name">GreenSteps</span>
          </div>
          <div className="navbar-actions">
            <a href="#about" className="nav-link">About</a>
            <a href="#features" className="nav-link">Features</a>
            {isLoggedIn ? (
              <>
                <span className="welcome-user">Welcome, {user?.name}!</span>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn  login-btn"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" >
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="app-name">GreenSteps</span>
              <span className="tagline">Zero Waste Lifestyle Tracker</span>
            </h1>
            <p className="hero-description">
              Track your waste. Earn rewards. Make a difference. 
              Join the movement towards a sustainable future—one step at a time.
            </p>
            <p className="hero-subtitle">
              Every action counts. Every choice matters. Turn your daily habits into 
              environmental impact with our innovative waste tracking system.
            </p>
            <div className="hero-buttons">
              {!isLoggedIn && (
                <button
                  className="btn btn-lg btn-primary"
                  onClick={() => navigate('/signup')}
                >
                  Start Your Journey 🚀
                </button>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="earth-icon">🌍</div>
              <div className="leaf-icon-1">🍃</div>
              <div className="leaf-icon-2">🍃</div>
              <div className="recycle-icon">♻️</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-header">
            <h2>About GreenSteps</h2>
            <p className="about-subtitle">Building a sustainable future, together</p>
          </div>

          <div className="about-content">
            <div className="about-card about-mission">
              <div className="about-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                GreenSteps empowers individuals to make a positive environmental impact 
                by tracking their waste, earning rewards, and competing on a global leaderboard. 
                We believe that small, consistent actions lead to big changes.
              </p>
            </div>

            <div className="about-card about-vision">
              <div className="about-icon">🌿</div>
              <h3>Our Vision</h3>
              <p>
                A world where sustainable living is the norm. We envision a future where 
                tracking waste is as natural as checking the weather, and where environmental 
                responsibility is celebrated and rewarded.
              </p>
            </div>

            <div className="about-card about-values">
              <div className="about-icon">💚</div>
              <h3>Our Values</h3>
              <p>
                Sustainability. Transparency. Community. We're committed to making environmental 
                action accessible to everyone, regardless of background or location. Together, 
                we can create lasting change.
              </p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Waste Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">♻️</div>
              <div className="stat-label">Sustainable Future</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">🌍</div>
              <div className="stat-label">Global Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-header">
          <h2>Why Choose GreenSteps?</h2>
          <p>Everything you need to start your zero-waste journey</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 - Track Waste */}
          <button 
            className="feature-card" 
            onClick={() => isLoggedIn ? navigate('/add-waste') : navigate('/signup')}
            type="button"
          >
            <div className="feature-icon">📊</div>
            <h3>Smart Waste Tracking</h3>
            <p>
              Easily log different waste types—plastic, paper, food, and glass. 
              Our intelligent system helps you understand your waste patterns and 
              identify opportunities to reduce consumption.
            </p>
            <div className="feature-cta">
              {isLoggedIn ? 'Start Tracking →' : 'Get Started →'}
            </div>
          </button>

          {/* Feature 2 - Earn Rewards */}
          <button 
            className="feature-card"
            onClick={() => isLoggedIn ? navigate('/rewards') : navigate('/signup')}
            type="button"
          >
            <div className="feature-icon">🏆</div>
            <h3>Earn Rewards & Badges</h3>
            <p>
              Every waste entry earns you points. Progress through our badge system from 
              Starter to Eco Warrior. Unlock achievements as you build your sustainable 
              lifestyle and watch your impact grow.
            </p>
            <div className="feature-cta">
              {isLoggedIn ? 'View Rewards →' : 'Get Started →'}
            </div>
          </button>

          {/* Feature 3 - Real-Time Stats */}
          <button 
            className="feature-card"
            onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/signup')}
            type="button"
          >
            <div className="feature-icon">📈</div>
            <h3>Real-Time Analytics</h3>
            <p>
              Get instant insights into your environmental impact. View detailed statistics, 
              track weekly progress, and see beautiful visualizations of your waste reduction 
              journey. Make data-driven decisions for a greener life.
            </p>
            <div className="feature-cta">
              {isLoggedIn ? 'View Dashboard →' : 'Get Started →'}
            </div>
          </button>

          {/* Feature 4 - Leaderboard */}
          <button 
            className="feature-card"
            onClick={() => isLoggedIn ? navigate('/rewards') : navigate('/signup')}
            type="button"
          >
            <div className="feature-icon">🌟</div>
            <h3>Global Community</h3>
            <p>
              Compete with eco-warriors worldwide. See how you rank on our global leaderboard, 
              get inspired by top performers, and join a thriving community dedicated to 
              environmental action.
            </p>
            <div className="feature-cta">
              {isLoggedIn ? 'Check Leaderboard →' : 'Get Started →'}
            </div>
          </button>

          {/* Feature 5 - History & Export */}
          <button 
            className="feature-card"
            onClick={() => isLoggedIn ? navigate('/waste-list') : navigate('/signup')}
            type="button"
          >
            <div className="feature-icon">📋</div>
            <h3>Complete History</h3>
            <p>
              Keep a comprehensive record of all your waste entries. Export your data as CSV 
              for personal records, reports, or analysis. Perfect for tracking your progress 
              over time.
            </p>
            <div className="feature-cta">
              {isLoggedIn ? 'View History →' : 'Get Started →'}
            </div>
          </button>

          {/* Feature 6 - Admin Dashboard */}
          <button 
            className="feature-card"
            onClick={() => isLoggedIn && user?.isAdmin ? navigate('/admin') : navigate('/signup')}
            type="button"
            disabled={isLoggedIn && !user?.isAdmin}
          >
            <div className="feature-icon">👥</div>
            <h3>Community Insights</h3>
            <p>
              Get system-wide insights into environmental impact. Admins can monitor community 
              progress, analyze trends, and export comprehensive reports to track our collective 
              journey toward zero waste.
            </p>
            <div className="feature-cta">
              {isLoggedIn && user?.isAdmin && 'Go to Admin →'}
              {isLoggedIn && !user?.isAdmin && 'Admin Only'}
              {!isLoggedIn && 'Get Started →'}
            </div>
          </button>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="impact-container">
          <h2>Why Zero Waste Matters</h2>
          <p className="impact-intro">
            Our planet is drowning in waste. Every year, billions of tons of trash pollute our environment. 
            But together, we can change this. Start your zero-waste journey today and be part of the solution.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon">🌊</div>
              <div className="impact-number">88%</div>
              <p className="impact-description">of plastic ever produced is still in our environment</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">🏭</div>
              <div className="impact-number">2B+</div>
              <p className="impact-description">tonnes of waste generated annually worldwide</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">💡</div>
              <div className="impact-number">1%</div>
              <p className="impact-description">individual change adds up to global transformation</p>
            </div>
          </div>
          <div className="impact-actions">
            <p className="impact-cta">Your actions matter. Track your waste and create a ripple effect of change.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
   

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🌱 GreenSteps</h4>
            <p>Zero Waste Lifestyle Tracker. Empowering individuals to build a sustainable future.</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul class="footer-links">
              <li><a href="#features">Waste Tracking</a></li>
              <li><a href="#features">Rewards System</a></li>
              <li><a href="#features">Analytics</a></li>
              <li><a href="#features">Community</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 GreenSteps - Zero Waste Lifestyle Tracker. All rights reserved. | Together for a greener planet.</p>
        </div>
      </footer>
    </div>
  );
};
