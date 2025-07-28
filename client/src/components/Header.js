import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isPremium } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/sessions', label: 'Sessions', icon: '🌍' },
    { path: '/trading', label: 'Trading', icon: '📈', premium: true },
    { path: '/premium', label: 'Premium', icon: '⭐' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header glass">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-gradient">Forex</span>
              <span className="logo-text">Tracker</span>
            </motion.div>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.premium && !isPremium() ? 'premium-locked' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.premium && !isPremium() && (
                  <span className="premium-badge">⭐</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            {user && (
              <div className="user-menu">
                <button className="btn-icon">
                  <FiBell />
                  <span className="notification-badge">3</span>
                </button>
                <Link to="/profile" className="btn-icon">
                  <FiUser />
                </Link>
              </div>
            )}

            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;