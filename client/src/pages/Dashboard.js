import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTrendingUp, FiAlertCircle, FiStar } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import WorldClock from '../components/WorldClock';
import TradingOverview from '../components/TradingOverview';
import './Dashboard.css';

const Dashboard = () => {
  const { sessions, isConnected } = useSocket();
  const { user, isPremium } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActiveSessions = () => {
    return Object.entries(sessions).filter(([_, session]) => session.status === 'open');
  };

  const getUpcomingSessions = () => {
    return Object.entries(sessions).filter(([_, session]) => session.status === 'upcoming');
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dashboard-header"
        >
          <div className="header-content">
            <div>
              <h1 className="text-gradient">Welcome back, {user?.name || 'Trader'}!</h1>
              <p className="subtitle">Track global Forex sessions and optimize your trading</p>
            </div>
            <div className="connection-status">
              <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                {isConnected ? 'Live' : 'Offline'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="current-time-card card"
        >
          <div className="time-display">
            <FiClock className="time-icon" />
            <div className="time-content">
              <h2>{formatTime(currentTime)}</h2>
              <p>{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="stats-grid"
        >
          <div className="stat-card card">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>{getActiveSessions().length}</h3>
              <p>Active Sessions</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3>{getUpcomingSessions().length}</h3>
              <p>Upcoming Sessions</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">
              <FiStar />
            </div>
            <div className="stat-content">
              <h3>{isPremium() ? 'Premium' : 'Free'}</h3>
              <p>Plan</p>
            </div>
          </div>
        </motion.div>

        {/* Sessions Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sessions-section"
        >
          <h2>Forex Sessions</h2>
          <div className="sessions-grid">
            {Object.entries(sessions).map(([key, session]) => (
              <SessionCard key={key} sessionKey={key} session={session} />
            ))}
          </div>
        </motion.div>

        {/* World Clock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="world-clock-section"
        >
          <h2>Global Time Zones</h2>
          <WorldClock />
        </motion.div>

        {/* Trading Overview (Premium) */}
        {isPremium() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="trading-overview-section"
          >
            <h2>Trading Overview</h2>
            <TradingOverview />
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="quick-actions"
        >
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card card">
              <h3>View All Sessions</h3>
              <p>Detailed session information and overlaps</p>
              <button className="btn btn-primary">Go to Sessions</button>
            </div>
            
            {isPremium() ? (
              <div className="action-card card">
                <h3>Trading Tools</h3>
                <p>Access premium trading recommendations</p>
                <button className="btn btn-primary">Open Trading</button>
              </div>
            ) : (
              <div className="action-card card premium-upgrade">
                <h3>Upgrade to Premium</h3>
                <p>Get smart trading recommendations and alerts</p>
                <button className="btn btn-primary">Upgrade Now</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;