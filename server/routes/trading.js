const express = require('express');
const router = express.Router();

// Mock data for premium features
const tradingData = {
  recommendations: {
    sydney: [
      { pair: 'AUD/USD', volatility: 'Low', recommendation: 'BUY', confidence: 75, reason: 'Strong AUD fundamentals' },
      { pair: 'NZD/USD', volatility: 'Low', recommendation: 'SELL', confidence: 68, reason: 'Weak NZD sentiment' }
    ],
    tokyo: [
      { pair: 'USD/JPY', volatility: 'Medium', recommendation: 'BUY', confidence: 82, reason: 'BOJ policy support' },
      { pair: 'EUR/JPY', volatility: 'Medium', recommendation: 'SELL', confidence: 71, reason: 'Euro weakness' }
    ],
    london: [
      { pair: 'EUR/USD', volatility: 'High', recommendation: 'BUY', confidence: 88, reason: 'ECB hawkish stance' },
      { pair: 'GBP/USD', volatility: 'High', recommendation: 'SELL', confidence: 79, reason: 'Brexit concerns' }
    ],
    newyork: [
      { pair: 'USD/CAD', volatility: 'High', recommendation: 'BUY', confidence: 85, reason: 'Strong USD momentum' },
      { pair: 'EUR/USD', volatility: 'High', recommendation: 'SELL', confidence: 76, reason: 'Fed policy divergence' }
    ]
  },
  
  volatilityScores: {
    sydney: { score: 2.1, description: 'Low volatility, good for position building' },
    tokyo: { score: 3.4, description: 'Moderate volatility, Yen pairs active' },
    london: { score: 4.8, description: 'High volatility, major pairs very active' },
    newyork: { score: 4.6, description: 'High volatility, especially during London overlap' }
  },
  
  strategies: {
    sydney: [
      { name: 'Position Building', description: 'Use low volatility to build positions for later sessions', pairs: ['AUD/USD', 'NZD/USD'] },
      { name: 'Range Trading', description: 'Trade within established ranges during quiet periods', pairs: ['AUD/JPY', 'NZD/JPY'] }
    ],
    tokyo: [
      { name: 'Yen Pairs Focus', description: 'Focus on USD/JPY and cross pairs', pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY'] },
      { name: 'Breakout Trading', description: 'Look for breakouts as Asian markets open', pairs: ['USD/JPY', 'AUD/JPY'] }
    ],
    london: [
      { name: 'Major Pairs Scalping', description: 'High-frequency trading on major pairs', pairs: ['EUR/USD', 'GBP/USD'] },
      { name: 'News Trading', description: 'Trade around European economic releases', pairs: ['EUR/USD', 'EUR/GBP'] }
    ],
    newyork: [
      { name: 'Overlap Trading', description: 'Trade during London-NY overlap for maximum volatility', pairs: ['EUR/USD', 'GBP/USD'] },
      { name: 'US Data Trading', description: 'Trade around US economic releases', pairs: ['USD/CAD', 'USD/CHF'] }
    ]
  },
  
  alerts: [
    { type: 'session_open', session: 'London', message: 'London session opening - expect increased volatility', priority: 'high' },
    { type: 'volatility_spike', pair: 'EUR/USD', message: 'EUR/USD volatility spike detected', priority: 'medium' },
    { type: 'news_impact', pair: 'GBP/USD', message: 'UK CPI data release in 30 minutes', priority: 'high' }
  ]
};

// Get trading recommendations for a session (Premium feature)
router.get('/recommendations/:session', (req, res) => {
  const { session } = req.params;
  
  if (!tradingData.recommendations[session]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    session,
    recommendations: tradingData.recommendations[session],
    timestamp: new Date().toISOString()
  });
});

// Get volatility scores for all sessions (Premium feature)
router.get('/volatility', (req, res) => {
  res.json({
    scores: tradingData.volatilityScores,
    timestamp: new Date().toISOString()
  });
});

// Get trading strategies for a session (Premium feature)
router.get('/strategies/:session', (req, res) => {
  const { session } = req.params;
  
  if (!tradingData.strategies[session]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    session,
    strategies: tradingData.strategies[session],
    timestamp: new Date().toISOString()
  });
});

// Get active alerts (Premium feature)
router.get('/alerts', (req, res) => {
  res.json({
    alerts: tradingData.alerts,
    count: tradingData.alerts.length,
    timestamp: new Date().toISOString()
  });
});

// Get AI session planner (Premium feature)
router.get('/planner', (req, res) => {
  const now = new Date();
  const userTimezone = req.query.timezone || 'UTC';
  
  // Mock AI planning based on current time and sessions
  const planner = {
    bestTradingTime: '14:00-16:00',
    recommendedPairs: ['EUR/USD', 'GBP/USD'],
    session: 'London-New York Overlap',
    confidence: 85,
    reasoning: 'Maximum liquidity and volatility during major session overlap',
    riskLevel: 'Medium-High',
    suggestedStrategy: 'Scalping with tight stops'
  };
  
  res.json({
    planner,
    userTimezone,
    timestamp: new Date().toISOString()
  });
});

// Get pair analysis (Premium feature)
router.get('/analysis/:pair', (req, res) => {
  const { pair } = req.params;
  
  const analysis = {
    pair,
    currentPrice: Math.random() * 2 + 0.8, // Mock price
    change24h: (Math.random() - 0.5) * 0.02, // Mock change
    volatility: Math.random() * 5 + 1,
    support: 1.0850,
    resistance: 1.0950,
    trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
    session: 'London',
    recommendation: Math.random() > 0.5 ? 'BUY' : 'SELL',
    confidence: Math.floor(Math.random() * 30) + 70,
    analysis: `Technical analysis shows ${pair} is in a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend with strong momentum.`
  };
  
  res.json({
    analysis,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;