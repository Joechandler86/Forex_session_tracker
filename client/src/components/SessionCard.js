import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiTrendingUp, FiInfo } from 'react-icons/fi';
import EducationalTooltip from './EducationalTooltip';
import './SessionCard.css';

const SessionCard = ({ sessionKey, session }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!session) return null;

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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.split(':').slice(0, 2).join(':');
  };

  const getSessionIcon = (sessionKey) => {
    const icons = {
      sydney: '🇦🇺',
      tokyo: '🇯🇵',
      london: '🇬🇧',
      newyork: '🇺🇸'
    };
    return icons[sessionKey] || '🌍';
  };

  return (
    <motion.div
      className="session-card card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="session-header">
        <div className="session-icon">
          {getSessionIcon(sessionKey)}
        </div>
        <div className="session-info">
          <h3>{session.name}</h3>
          <div className="session-status">
            <span 
              className="status-dot"
              style={{ backgroundColor: getStatusColor(session.status) }}
            ></span>
            <span className={`status-text status-${session.status}`}>
              {getStatusText(session.status)}
            </span>
          </div>
        </div>
        <button 
          className="info-btn"
          onClick={() => setShowTooltip(true)}
          title="View trading tips"
        >
          <FiInfo />
        </button>
      </div>

      <div className="session-details">
        <div className="detail-item">
          <FiMapPin className="detail-icon" />
          <span>{session.timezone}</span>
        </div>
        
        <div className="detail-item">
          <FiClock className="detail-icon" />
          <span>
            {formatTime(session.openTime)} - {formatTime(session.closeTime)}
          </span>
        </div>

        {session.currentTime && (
          <div className="detail-item">
            <FiTrendingUp className="detail-icon" />
            <span>Local: {session.currentTime}</span>
          </div>
        )}
      </div>

      {session.pairs && session.pairs.length > 0 && (
        <div className="session-pairs">
          <h4>Key Pairs</h4>
          <div className="pairs-list">
            {session.pairs.slice(0, 3).map((pair, index) => (
              <span key={index} className="pair-tag">
                {pair}
              </span>
            ))}
            {session.pairs.length > 3 && (
              <span className="pair-tag more">
                +{session.pairs.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {session.description && (
        <div className="session-description">
          <p>{session.description}</p>
        </div>
      )}

      {session.status === 'upcoming' && session.timeUntilOpen && (
        <div className="countdown">
          <span>Opens in: {Math.floor(session.timeUntilOpen / 60000)}m</span>
        </div>
      )}

      {session.status === 'open' && session.timeUntilClose && (
        <div className="countdown">
          <span>Closes in: {Math.floor(session.timeUntilClose / 60000)}m</span>
        </div>
      )}

      {/* Educational Tooltip */}
      <EducationalTooltip
        session={session}
        isVisible={showTooltip}
        onClose={() => setShowTooltip(false)}
      />
    </motion.div>
  );
};

export default SessionCard;