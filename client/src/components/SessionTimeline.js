import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';
import './SessionTimeline.css';

const SessionTimeline = () => {
  const [sessions, setSessions] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
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

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      if (socket) {
        socket.off('sessions-update');
      }
      clearInterval(timeInterval);
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
      shortName: 'SYD',
      color: '#667eea',
      startHour: 22,
      endHour: 7,
      keyPairs: ['AUD/USD', 'AUD/JPY', 'NZD/USD'],
      description: 'First session to open, sets the tone for the day'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      shortName: 'TKY',
      color: '#f59e0b',
      startHour: 0,
      endHour: 9,
      keyPairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY'],
      description: 'Asian session, known for yen crosses'
    },
    {
      id: 'london',
      name: 'London',
      shortName: 'LON',
      color: '#22c55e',
      startHour: 8,
      endHour: 17,
      keyPairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP'],
      description: 'Most liquid session, highest volatility'
    },
    {
      id: 'newyork',
      name: 'New York',
      shortName: 'NYC',
      color: '#ef4444',
      startHour: 13,
      endHour: 22,
      keyPairs: ['USD/CAD', 'USD/CHF', 'EUR/USD'],
      description: 'US session, overlaps with London for maximum liquidity'
    }
  ];

  const getSessionStatus = (sessionId) => {
    const session = sessions[sessionId];
    if (!session) return 'unknown';
    return session.status;
  };

  const getCurrentHour = () => {
    return currentTime.getHours();
  };

  const isSessionActive = (session) => {
    const currentHour = getCurrentHour();
    const { startHour, endHour } = session;
    
    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      // Session spans midnight
      return currentHour >= startHour || currentHour < endHour;
    }
  };

  const getSessionPosition = (session) => {
    const { startHour, endHour } = session;
    const startPercent = (startHour / 24) * 100;
    const endPercent = (endHour / 24) * 100;
    
    if (startHour <= endHour) {
      return {
        left: startPercent,
        width: endPercent - startPercent
      };
    } else {
      // Session spans midnight
      return {
        left: startPercent,
        width: 100 - startPercent
      };
    }
  };

  const getOverlappingSessions = () => {
    const overlaps = [];
    const currentHour = getCurrentHour();

    for (let i = 0; i < sessionData.length; i++) {
      for (let j = i + 1; j < sessionData.length; j++) {
        const session1 = sessionData[i];
        const session2 = sessionData[j];
        
        const isSession1Active = isSessionActive(session1);
        const isSession2Active = isSessionActive(session2);
        
        if (isSession1Active && isSession2Active) {
          overlaps.push({
            session1: session1.name,
            session2: session2.name,
            pairs: [...session1.keyPairs, ...session2.keyPairs]
          });
        }
      }
    }

    return overlaps;
  };

  const formatHour = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getCurrentTimePosition = () => {
    const currentHour = getCurrentHour();
    const currentMinute = currentTime.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    return (totalMinutes / (24 * 60)) * 100;
  };

  return (
    <div className="session-timeline-container">
      <div className="timeline-header">
        <h3>24-Hour Session Timeline</h3>
        <p>Visual representation of Forex market sessions and overlaps</p>
      </div>

      <div className="timeline-wrapper">
        {/* Time markers */}
        <div className="time-markers">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="time-marker">
              <span className="time-label">{formatHour(i)}</span>
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        <div 
          className="current-time-indicator"
          style={{ left: `${getCurrentTimePosition()}%` }}
        >
          <div className="indicator-line"></div>
          <div className="indicator-dot"></div>
          <span className="current-time">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {/* Session tracks */}
        <div className="session-tracks">
          {sessionData.map((session) => {
            const status = getSessionStatus(session.id);
            const isActive = isSessionActive(session);
            const position = getSessionPosition(session);

            return (
              <motion.div
                key={session.id}
                className={`session-track ${isActive ? 'active' : ''} ${status}`}
                style={{
                  left: `${position.left}%`,
                  width: `${position.width}%`,
                  backgroundColor: session.color
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="session-info">
                  <div className="session-header">
                    <span className="session-name">{session.shortName}</span>
                    <span className="session-status">
                      {isActive ? 'Active' : status === 'upcoming' ? 'Upcoming' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="session-times">
                    <span>{formatHour(session.startHour)} - {formatHour(session.endHour)}</span>
                  </div>

                  <div className="session-pairs">
                    {session.keyPairs.slice(0, 2).map((pair, index) => (
                      <span key={index} className="pair-tag">{pair}</span>
                    ))}
                    {session.keyPairs.length > 2 && (
                      <span className="more-pairs">+{session.keyPairs.length - 2}</span>
                    )}
                  </div>
                </div>

                {/* Pulse animation for active sessions */}
                {isActive && (
                  <motion.div
                    className="pulse-animation"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 0.4, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Overlaps section */}
      <div className="overlaps-section">
        <h4>Current Overlaps</h4>
        <div className="overlaps-list">
          {getOverlappingSessions().length > 0 ? (
            getOverlappingSessions().map((overlap, index) => (
              <motion.div
                key={index}
                className="overlap-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="overlap-header">
                  <FiTrendingUp className="overlap-icon" />
                  <span className="overlap-sessions">
                    {overlap.session1} + {overlap.session2}
                  </span>
                </div>
                <div className="overlap-pairs">
                  {overlap.pairs.slice(0, 4).map((pair, pairIndex) => (
                    <span key={pairIndex} className="pair-tag">{pair}</span>
                  ))}
                  {overlap.pairs.length > 4 && (
                    <span className="more-pairs">+{overlap.pairs.length - 4}</span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-overlaps">
              <FiAlertCircle className="no-overlaps-icon" />
              <span>No active session overlaps at the moment</span>
            </div>
          )}
        </div>
      </div>

      {/* Session legend */}
      <div className="session-legend">
        <h4>Session Legend</h4>
        <div className="legend-grid">
          {sessionData.map((session) => (
            <div key={session.id} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: session.color }}
              ></div>
              <div className="legend-info">
                <span className="legend-name">{session.name}</span>
                <span className="legend-time">
                  {formatHour(session.startHour)} - {formatHour(session.endHour)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionTimeline;