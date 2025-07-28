import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiAlertTriangle, FiBarChart3, FiClock, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Trading.css';

const Trading = () => {
  const { isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [volatilityData, setVolatilityData] = useState({});
  const [strategies, setStrategies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const [recRes, volRes, stratRes, alertsRes] = await Promise.all([
          axios.get('/api/trading/recommendations/london'),
          axios.get('/api/trading/volatility'),
          axios.get('/api/trading/strategies/london'),
          axios.get('/api/trading/alerts')
        ]);

        setRecommendations(recRes.data.recommendations);
        setVolatilityData(volRes.data.scores);
        setStrategies(stratRes.data.strategies);
        setAlerts(alertsRes.data.alerts);
      } catch (error) {
        console.error('Error fetching trading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isPremium()) {
      fetchTradingData();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  if (!isPremium()) {
    return (
      <div className="trading-page">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="premium-required"
          >
            <div className="premium-card card">
              <div className="premium-icon">⭐</div>
              <h1>Premium Feature</h1>
              <p>Access advanced trading tools, recommendations, and analysis</p>
              <div className="premium-features">
                <div className="feature-item">
                  <FiTarget />
                  <span>Smart Pair Recommendations</span>
                </div>
                <div className="feature-item">
                  <FiBarChart3 />
                  <span>Volatility Analysis</span>
                </div>
                <div className="feature-item">
                  <FiTrendingUp />
                  <span>Trading Strategies</span>
                </div>
                <div className="feature-item">
                  <FiAlertTriangle />
                  <span>Real-time Alerts</span>
                </div>
              </div>
              <button className="btn btn-primary">Upgrade to Premium</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="trading-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading trading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header"
        >
          <div>
            <h1 className="text-gradient">Trading Tools</h1>
            <p className="subtitle">Advanced trading analysis and recommendations</p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tabs-container"
        >
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              <FiTarget />
              Recommendations
            </button>
            <button
              className={`tab ${activeTab === 'volatility' ? 'active' : ''}`}
              onClick={() => setActiveTab('volatility')}
            >
              <FiBarChart3 />
              Volatility
            </button>
            <button
              className={`tab ${activeTab === 'strategies' ? 'active' : ''}`}
              onClick={() => setActiveTab('strategies')}
            >
              <FiTrendingUp />
              Strategies
            </button>
            <button
              className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              <FiAlertTriangle />
              Alerts
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="tab-content"
        >
          {activeTab === 'recommendations' && (
            <div className="recommendations-section">
              <h2>Smart Trading Recommendations</h2>
              <div className="recommendations-grid">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className="recommendation-card card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="rec-header">
                      <div className="pair-info">
                        <h3>{rec.pair}</h3>
                        <span className={`action-badge ${rec.recommendation.toLowerCase()}`}>
                          {rec.recommendation}
                        </span>
                      </div>
                      <div className="confidence-meter">
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill"
                            style={{ width: `${rec.confidence}%` }}
                          ></div>
                        </div>
                        <span className="confidence-text">{rec.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="rec-details">
                      <div className="detail-row">
                        <span className="label">Volatility:</span>
                        <span className="value">{rec.volatility}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Reason:</span>
                        <span className="value reason">{rec.reason}</span>
                      </div>
                    </div>

                    <div className="rec-actions">
                      <button className="btn btn-secondary">View Analysis</button>
                      <button className="btn btn-primary">Set Alert</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'volatility' && (
            <div className="volatility-section">
              <h2>Session Volatility Analysis</h2>
              <div className="volatility-grid">
                {Object.entries(volatilityData).map(([session, data]) => (
                  <motion.div
                    key={session}
                    className="volatility-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="session-header">
                      <h3>{session.charAt(0).toUpperCase() + session.slice(1)}</h3>
                      <div className="volatility-score">
                        <span className="score">{data.score}</span>
                        <span className="max-score">/5</span>
                      </div>
                    </div>
                    
                    <div className="volatility-bar">
                      <div 
                        className="volatility-fill"
                        style={{ 
                          width: `${(data.score / 5) * 100}%`,
                          backgroundColor: data.score >= 4 ? '#ef4444' : data.score >= 3 ? '#f59e0b' : '#22c55e'
                        }}
                      ></div>
                    </div>
                    
                    <p className="volatility-description">{data.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategies' && (
            <div className="strategies-section">
              <h2>Trading Strategies</h2>
              <div className="strategies-grid">
                {strategies.map((strategy, index) => (
                  <motion.div
                    key={index}
                    className="strategy-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="strategy-header">
                      <h3>{strategy.name}</h3>
                      <div className="strategy-icon">📈</div>
                    </div>
                    
                    <p className="strategy-description">{strategy.description}</p>
                    
                    <div className="strategy-pairs">
                      <h4>Recommended Pairs:</h4>
                      <div className="pairs-list">
                        {strategy.pairs.map((pair, idx) => (
                          <span key={idx} className="pair-tag">{pair}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-section">
              <h2>Market Alerts</h2>
              <div className="alerts-list">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    className={`alert-card card ${alert.priority}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="alert-header">
                      <div className="alert-type">
                        <span className="alert-icon">
                          {alert.type === 'session_open' ? '🕐' : 
                           alert.type === 'volatility_spike' ? '📊' : '📰'}
                        </span>
                        <span className="alert-title">{alert.message}</span>
                      </div>
                      <span className={`priority-badge ${alert.priority}`}>
                        {alert.priority}
                      </span>
                    </div>
                    
                    {alert.pair && (
                      <div className="alert-pair">
                        <span className="label">Pair:</span>
                        <span className="value">{alert.pair}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Trading;