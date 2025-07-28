import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiClock, FiMapPin } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';
import './WorldMap.css';

const WorldMap = () => {
  const [sessions, setSessions] = useState({});
  const [hoveredSession, setHoveredSession] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    // Fetch initial sessions data
    fetchSessions();

    // Listen for real-time updates
    if (socket) {
      socket.on('sessions-update', (data) => {
        setSessions(data);
      });
    }

    return () => {
      if (socket) {
        socket.off('sessions-update');
      }
    };
  }, [socket]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions/current');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const sessionData = [
    {
      id: 'sydney',
      name: 'Sydney',
      city: 'Sydney',
      country: 'Australia',
      coordinates: { x: 85, y: 75 },
      timezone: 'Australia/Sydney',
      openTime: '22:00',
      closeTime: '07:00',
      keyPairs: ['AUD/USD', 'AUD/JPY', 'NZD/USD'],
      description: 'First session to open, sets the tone for the day'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      city: 'Tokyo',
      country: 'Japan',
      coordinates: { x: 75, y: 45 },
      timezone: 'Asia/Tokyo',
      openTime: '00:00',
      closeTime: '09:00',
      keyPairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY'],
      description: 'Asian session, known for yen crosses'
    },
    {
      id: 'london',
      name: 'London',
      city: 'London',
      country: 'UK',
      coordinates: { x: 45, y: 35 },
      timezone: 'Europe/London',
      openTime: '08:00',
      closeTime: '17:00',
      keyPairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP'],
      description: 'Most liquid session, highest volatility'
    },
    {
      id: 'newyork',
      name: 'New York',
      city: 'New York',
      country: 'USA',
      coordinates: { x: 25, y: 40 },
      timezone: 'America/New_York',
      openTime: '13:00',
      closeTime: '22:00',
      keyPairs: ['USD/CAD', 'USD/CHF', 'EUR/USD'],
      description: 'US session, overlaps with London for maximum liquidity'
    }
  ];

  const getSessionStatus = (sessionId) => {
    const session = sessions[sessionId];
    if (!session) return 'unknown';
    return session.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#22c55e';
      case 'closed':
        return '#ef4444';
      case 'upcoming':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="world-map-container">
      <div className="map-header">
        <h3>Global Forex Sessions</h3>
        <p>Interactive world map showing live session status</p>
      </div>

      <div className="world-map">
        {/* World Map Background */}
        <div className="map-background">
          <div className="continents">
            {/* Simplified continent shapes */}
            <div className="continent asia"></div>
            <div className="continent europe"></div>
            <div className="continent africa"></div>
            <div className="continent americas"></div>
            <div className="continent australia"></div>
          </div>
        </div>

        {/* Session Markers */}
        {sessionData.map((session) => {
          const status = getSessionStatus(session.id);
          const isActive = status === 'open';
          const isHovered = hoveredSession === session.id;

          return (
            <motion.div
              key={session.id}
              className={`session-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
              style={{
                left: `${session.coordinates.x}%`,
                top: `${session.coordinates.y}%`
              }}
              onMouseEnter={() => setHoveredSession(session.id)}
              onMouseLeave={() => setHoveredSession(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse animation for active sessions */}
              {isActive && (
                <motion.div
                  className="pulse-ring"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Session Icon */}
              <div 
                className="marker-icon"
                style={{ backgroundColor: getStatusColor(status) }}
              >
                <FiMapPin />
              </div>

              {/* Session Label */}
              <div className="session-label">
                <span className="session-name">{session.name}</span>
                <span className="session-status">{getStatusText(status)}</span>
              </div>

              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  className="session-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="tooltip-header">
                    <h4>{session.city}, {session.country}</h4>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
                      {getStatusText(status)}
                    </span>
                  </div>
                  
                  <div className="tooltip-content">
                    <div className="time-info">
                      <div className="time-item">
                        <span className="label">Open:</span>
                        <span className="time">{session.openTime}</span>
                      </div>
                      <div className="time-item">
                        <span className="label">Close:</span>
                        <span className="time">{session.closeTime}</span>
                      </div>
                    </div>
                    
                    <div className="key-pairs">
                      <span className="label">Key Pairs:</span>
                      <div className="pairs-list">
                        {session.keyPairs.map((pair, index) => (
                          <span key={index} className="pair-tag">{pair}</span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="description">{session.description}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Connection Lines for Overlapping Sessions */}
        <svg className="connection-lines" width="100%" height="100%">
          <defs>
            <linearGradient id="overlapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* London-New York Overlap */}
          <line
            x1="45%"
            y1="35%"
            x2="25%"
            y2="40%"
            stroke="url(#overlapGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.8"
          />
          
          {/* Tokyo-London Overlap */}
          <line
            x1="75%"
            y1="45%"
            x2="45%"
            y2="35%"
            stroke="url(#overlapGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Session Legend */}
      <div className="session-legend">
        <h4>Session Status</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Open</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Closed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="map-stats">
        <div className="stat-item">
          <div className="stat-value">
            {Object.values(sessions).filter(s => s?.status === 'open').length}
          </div>
          <div className="stat-label">Active Sessions</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {Object.values(sessions).filter(s => s?.status === 'upcoming').length}
          </div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {Object.values(sessions).filter(s => s?.status === 'closed').length}
          </div>
          <div className="stat-label">Closed</div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;