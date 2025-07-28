import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiTrendingUp, FiAlertTriangle, FiTarget } from 'react-icons/fi';
import './EducationalTooltip.css';

const EducationalTooltip = ({ session, isVisible, onClose }) => {
  const [currentTip, setCurrentTip] = useState(0);

  const sessionTips = {
    sydney: [
      {
        icon: <FiTrendingUp />,
        title: "Position Building",
        description: "Sydney session is ideal for building positions in AUD and NZD pairs. Low volatility allows for better entry points.",
        color: "#667eea"
      },
      {
        icon: <FiTarget />,
        title: "Key Pairs",
        description: "Focus on AUD/USD, AUD/JPY, and NZD/USD. These pairs show the most activity during Sydney hours.",
        color: "#f59e0b"
      },
      {
        icon: <FiAlertTriangle />,
        title: "Volatility Warning",
        description: "Be cautious of sudden moves when Tokyo session opens, as it can create significant volatility.",
        color: "#ef4444"
      }
    ],
    tokyo: [
      {
        icon: <FiTrendingUp />,
        title: "Yen Pairs Active",
        description: "Tokyo session is perfect for trading USD/JPY, EUR/JPY, and GBP/JPY. Yen crosses are most active.",
        color: "#f59e0b"
      },
      {
        icon: <FiTarget />,
        title: "Asian Markets",
        description: "Watch for news from Japan, China, and Australia. Economic data can cause significant moves.",
        color: "#22c55e"
      },
      {
        icon: <FiAlertTriangle />,
        title: "Moderate Volatility",
        description: "Volatility is moderate compared to London/NY overlap. Good for range trading strategies.",
        color: "#667eea"
      }
    ],
    london: [
      {
        icon: <FiTrendingUp />,
        title: "Highest Liquidity",
        description: "London session provides the highest liquidity and volatility. Major pairs are very active.",
        color: "#22c55e"
      },
      {
        icon: <FiTarget />,
        title: "Major Pairs",
        description: "Focus on EUR/USD, GBP/USD, and EUR/GBP. These pairs see maximum activity during London.",
        color: "#ef4444"
      },
      {
        icon: <FiAlertTriangle />,
        title: "News Trading",
        description: "European economic news can cause significant moves. Monitor ECB and BOE announcements.",
        color: "#f59e0b"
      }
    ],
    newyork: [
      {
        icon: <FiTrendingUp />,
        title: "US Session Power",
        description: "New York session brings high volatility, especially during London overlap. USD pairs are most active.",
        color: "#ef4444"
      },
      {
        icon: <FiTarget />,
        title: "USD Pairs",
        description: "Trade USD/CAD, USD/CHF, and EUR/USD. US economic data drives major moves.",
        color: "#22c55e"
      },
      {
        icon: <FiAlertTriangle />,
        title: "Overlap Trading",
        description: "London-NY overlap (13:00-17:00 UTC) is the most volatile period. Use proper risk management.",
        color: "#667eea"
      }
    ]
  };

  const tips = sessionTips[session?.id] || [];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!isVisible || !session) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="educational-tooltip-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="educational-tooltip"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tooltip-header">
            <div className="session-info">
              <h3>{session.name} Session</h3>
              <span className="session-time">
                {session.openTime} - {session.closeTime}
              </span>
            </div>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="tooltip-content">
            {tips.length > 0 ? (
              <>
                <div className="tip-display">
                  <div 
                    className="tip-icon"
                    style={{ backgroundColor: tips[currentTip].color }}
                  >
                    {tips[currentTip].icon}
                  </div>
                  <div className="tip-content">
                    <h4>{tips[currentTip].title}</h4>
                    <p>{tips[currentTip].description}</p>
                  </div>
                </div>

                {tips.length > 1 && (
                  <div className="tip-navigation">
                    <button 
                      className="nav-btn prev"
                      onClick={prevTip}
                      disabled={currentTip === 0}
                    >
                      ‹
                    </button>
                    <div className="tip-indicators">
                      {tips.map((_, index) => (
                        <div
                          key={index}
                          className={`indicator ${index === currentTip ? 'active' : ''}`}
                          onClick={() => setCurrentTip(index)}
                        />
                      ))}
                    </div>
                    <button 
                      className="nav-btn next"
                      onClick={nextTip}
                      disabled={currentTip === tips.length - 1}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-tips">
                <FiInfo className="no-tips-icon" />
                <p>No educational tips available for this session.</p>
              </div>
            )}
          </div>

          <div className="tooltip-footer">
            <div className="session-pairs">
              <span className="label">Key Pairs:</span>
              <div className="pairs-list">
                {session.keyPairs?.map((pair, index) => (
                  <span key={index} className="pair-tag">{pair}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EducationalTooltip;