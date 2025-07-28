import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiClock } from 'react-icons/fi';
import './WorldClock.css';

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeZones = [
    { name: 'UTC', zone: 'UTC', icon: '🌍' },
    { name: 'New York', zone: 'America/New_York', icon: '🇺🇸' },
    { name: 'London', zone: 'Europe/London', icon: '🇬🇧' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', icon: '🇯🇵' },
    { name: 'Sydney', zone: 'Australia/Sydney', icon: '🇦🇺' },
    { name: 'Dubai', zone: 'Asia/Dubai', icon: '🇦🇪' }
  ];

  const formatTime = (date, timeZone) => {
    try {
      return date.toLocaleTimeString('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return '--:--:--';
    }
  };

  const formatDate = (date, timeZone) => {
    try {
      return date.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '--';
    }
  };

  const getTimeZoneOffset = (timeZone) => {
    try {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utc + (now.toLocaleString("en-US", { timeZone })));
      const offset = (targetTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return offset;
    } catch (error) {
      return 0;
    }
  };

  return (
    <div className="world-clock">
      <div className="clock-grid">
        {timeZones.map((tz, index) => {
          const offset = getTimeZoneOffset(tz.zone);
          const isPositive = offset >= 0;
          
          return (
            <motion.div
              key={tz.zone}
              className="clock-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="clock-header">
                <div className="clock-icon">
                  {tz.icon}
                </div>
                <div className="clock-info">
                  <h3>{tz.name}</h3>
                  <div className="timezone-offset">
                    <span className={`offset-sign ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{offset.toFixed(0)}h
                    </span>
                  </div>
                </div>
              </div>

              <div className="clock-time">
                <div className="time-display">
                  <FiClock className="time-icon" />
                  <span className="time-text">
                    {formatTime(currentTime, tz.zone)}
                  </span>
                </div>
                <div className="date-display">
                  {formatDate(currentTime, tz.zone)}
                </div>
              </div>

              <div className="clock-footer">
                <span className="timezone-name">{tz.zone}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="clock-legend">
        <div className="legend-item">
          <span className="legend-dot positive"></span>
          <span>Ahead of UTC</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot negative"></span>
          <span>Behind UTC</span>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;