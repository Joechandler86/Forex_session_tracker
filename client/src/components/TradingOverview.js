import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertTriangle, FiTarget, FiBarChart3 } from 'react-icons/fi';
import axios from 'axios';
import './TradingOverview.css';

const TradingOverview = () => {
  const [volatilityData, setVolatilityData] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const [volatilityRes, recommendationsRes] = await Promise.all([
          axios.get('/api/trading/volatility'),
          axios.get('/api/trading/recommendations/london')
        ]);

        setVolatilityData(volatilityRes.data.scores);
        setRecommendations(recommendationsRes.data.recommendations);
      } catch (error) {
        console.error('Error fetching trading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradingData();
  }, []);

  const getVolatilityColor = (score) => {
    if (score >= 4) return '#ef4444'; // High - Red
    if (score >= 3) return '#f59e0b'; // Medium - Orange
    return '#22c55e'; // Low - Green
  };

  const getVolatilityLabel = (score) => {
    if (score >= 4) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="trading-overview">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-overview">
      <div className="overview-grid">
        {/* Volatility Overview */}
        <motion.div
          className="overview-card card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-header">
            <FiBarChart3 className="card-icon" />
            <h3>Session Volatility</h3>
          </div>
          <div className="volatility-grid">
            {Object.entries(volatilityData).map(([session, data]) => (
              <div key={session} className="volatility-item">
                <div className="session-name">{session.charAt(0).toUpperCase() + session.slice(1)}</div>
                <div className="volatility-score">
                  <div 
                    className="score-bar"
                    style={{ 
                      backgroundColor: getVolatilityColor(data.score),
                      width: `${(data.score / 5) * 100}%`
                    }}
                  ></div>
                  <span className="score-value">{data.score}</span>
                </div>
                <div className="volatility-label" style={{ color: getVolatilityColor(data.score) }}>
                  {getVolatilityLabel(data.score)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trading Recommendations */}
        <motion.div
          className="overview-card card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="card-header">
            <FiTarget className="card-icon" />
            <h3>Top Recommendations</h3>
          </div>
          <div className="recommendations-list">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="recommendation-item">
                <div className="rec-header">
                  <span className="pair-name">{rec.pair}</span>
                  <span className={`rec-action ${rec.recommendation.toLowerCase()}`}>
                    {rec.recommendation}
                  </span>
                </div>
                <div className="rec-details">
                  <div className="rec-confidence">
                    <span className="confidence-label">Confidence:</span>
                    <span className="confidence-value">{rec.confidence}%</span>
                  </div>
                  <div className="rec-volatility">
                    <span className="volatility-label">Volatility:</span>
                    <span className="volatility-value">{rec.volatility}</span>
                  </div>
                </div>
                <div className="rec-reason">
                  <span className="reason-label">Reason:</span>
                  <span className="reason-text">{rec.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Alerts */}
        <motion.div
          className="overview-card card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card-header">
            <FiAlertTriangle className="card-icon" />
            <h3>Market Alerts</h3>
          </div>
          <div className="alerts-list">
            <div className="alert-item high-priority">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <div className="alert-title">London Session Opening</div>
                <div className="alert-message">Expect increased volatility in EUR/USD and GBP/USD</div>
                <div className="alert-time">In 30 minutes</div>
              </div>
            </div>
            <div className="alert-item medium-priority">
              <div className="alert-icon">📊</div>
              <div className="alert-content">
                <div className="alert-title">Volatility Spike</div>
                <div className="alert-message">USD/JPY showing unusual volatility patterns</div>
                <div className="alert-time">5 minutes ago</div>
              </div>
            </div>
            <div className="alert-item low-priority">
              <div className="alert-icon">📈</div>
              <div className="alert-content">
                <div className="alert-title">Trend Change</div>
                <div className="alert-message">AUD/USD breaking key resistance level</div>
                <div className="alert-time">15 minutes ago</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="overview-card card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="card-header">
            <FiTrendingUp className="card-icon" />
            <h3>Trading Stats</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">4</div>
              <div className="stat-label">Active Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Major Pairs</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">85%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">2.4</div>
              <div className="stat-label">Avg Volatility</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TradingOverview;