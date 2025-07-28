import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiTrendingUp, FiInfo, FiGlobe, FiBarChart3 } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';
import SessionCard from '../components/SessionCard';
import WorldMap from '../components/WorldMap';
import SessionTimeline from '../components/SessionTimeline';
import './Sessions.css';

const Sessions = () => {
  const { sessions, isConnected } = useSocket();
  const [overlaps, setOverlaps] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'map', 'timeline'

  useEffect(() => {
    const fetchOverlaps = async () => {
      try {
        const response = await fetch('/api/sessions/overlaps');
        const data = await response.json();
        setOverlaps(data);
      } catch (error) {
        console.error('Error fetching overlaps:', error);
      }
    };

    fetchOverlaps();
  }, []);

  const getSessionStatus = (session) => {
    if (!session) return 'unknown';
    return session.status || 'unknown';
  };

  const getActiveSessions = () => {
    return Object.entries(sessions).filter(([_, session]) => session.status === 'open');
  };

  const getUpcomingSessions = () => {
    return Object.entries(sessions).filter(([_, session]) => session.status === 'upcoming');
  };

  const getClosedSessions = () => {
    return Object.entries(sessions).filter(([_, session]) => session.status === 'closed');
  };

  return (
    <div className="sessions-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header"
        >
          <div className="header-content">
            <div>
              <h1 className="text-gradient">Forex Sessions</h1>
              <p className="subtitle">Track global market sessions and their overlaps</p>
            </div>
            <div className="connection-status">
              <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                {isConnected ? 'Live Updates' : 'Offline'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="view-mode-toggle"
        >
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <FiBarChart3 />
              <span>Cards</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <FiGlobe />
              <span>World Map</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <FiClock />
              <span>Timeline</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="stats-overview"
        >
          <div className="stat-card card">
            <div className="stat-icon active">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>{getActiveSessions().length}</h3>
              <p>Active Sessions</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon upcoming">
              <FiClock />
            </div>
            <div className="stat-content">
              <h3>{getUpcomingSessions().length}</h3>
              <p>Upcoming Sessions</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon overlaps">
              <FiMapPin />
            </div>
            <div className="stat-content">
              <h3>{overlaps.length}</h3>
              <p>Session Overlaps</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon closed">
              <FiInfo />
            </div>
            <div className="stat-content">
              <h3>{getClosedSessions().length}</h3>
              <p>Closed Sessions</p>
            </div>
          </div>
        </motion.div>

        {/* Interactive View Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="interactive-view"
        >
          {viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WorldMap />
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SessionTimeline />
            </motion.div>
          )}

          {viewMode === 'cards' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sessions-grid">
                {Object.entries(sessions).map(([key, session]) => (
                  <SessionCard key={key} sessionKey={key} session={session} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Session Overlaps */}
        {overlaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="overlaps-section"
          >
            <h2>Session Overlaps</h2>
            <div className="overlaps-grid">
              {overlaps.map((overlap, index) => (
                <motion.div
                  key={index}
                  className="overlap-card card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="overlap-header">
                    <h3>{overlap.session1} + {overlap.session2}</h3>
                    <div className="overlap-badge">Overlap</div>
                  </div>
                  <div className="overlap-time">
                    <span className="time-label">Overlap Time:</span>
                    <span className="time-value">
                      {overlap.overlapStart} - {overlap.overlapEnd}
                    </span>
                  </div>
                  <div className="overlap-description">
                    <p>High volatility period with maximum liquidity</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}



        {/* Session Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="session-info"
        >
          <h2>Trading Session Information</h2>
          <div className="info-grid">
            <div className="info-card card">
              <h3>Session Characteristics</h3>
              <ul>
                <li><strong>Sydney:</strong> Low volatility, good for position building</li>
                <li><strong>Tokyo:</strong> Yen pairs active, moderate volatility</li>
                <li><strong>London:</strong> Highest liquidity, major pairs very active</li>
                <li><strong>New York:</strong> High volatility, especially during London overlap</li>
              </ul>
            </div>

            <div className="info-card card">
              <h3>Trading Tips</h3>
              <ul>
                <li>Trade during session overlaps for maximum volatility</li>
                <li>Use session-specific pairs for better results</li>
                <li>Monitor economic news during session openings</li>
                <li>Adjust position sizes based on session volatility</li>
              </ul>
            </div>

            <div className="info-card card">
              <h3>Best Trading Times</h3>
              <ul>
                <li><strong>London-NY Overlap:</strong> 13:00-17:00 UTC</li>
                <li><strong>Tokyo-London Overlap:</strong> 08:00-09:00 UTC</li>
                <li><strong>Sydney-Tokyo Overlap:</strong> 22:00-00:00 UTC</li>
                <li><strong>News Trading:</strong> During session openings</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sessions;