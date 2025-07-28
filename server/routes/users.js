const express = require('express');
const router = express.Router();

// Mock user data (in production, this would be in a database)
let users = [
  {
    id: 1,
    email: 'demo@example.com',
    name: 'Demo User',
    subscription: 'premium',
    timezone: 'America/New_York',
    preferences: {
      alerts: true,
      notifications: true,
      defaultSession: 'london'
    }
  }
];

// Get user profile
router.get('/profile', (req, res) => {
  // In production, this would check JWT token
  const user = users[0]; // Mock user for demo
  res.json(user);
});

// Update user profile
router.put('/profile', (req, res) => {
  const { timezone, preferences } = req.body;
  
  // In production, this would update the database
  users[0] = {
    ...users[0],
    timezone: timezone || users[0].timezone,
    preferences: { ...users[0].preferences, ...preferences }
  };
  
  res.json({ message: 'Profile updated successfully', user: users[0] });
});

// Get user preferences
router.get('/preferences', (req, res) => {
  const user = users[0];
  res.json(user.preferences);
});

// Update user preferences
router.put('/preferences', (req, res) => {
  const preferences = req.body;
  
  users[0].preferences = { ...users[0].preferences, ...preferences };
  
  res.json({ message: 'Preferences updated successfully', preferences: users[0].preferences });
});

// Get user alerts
router.get('/alerts', (req, res) => {
  const user = users[0];
  
  // Mock user alerts
  const alerts = [
    {
      id: 1,
      type: 'session_open',
      session: 'London',
      message: 'London session opening in 30 minutes',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      type: 'volatility_spike',
      pair: 'EUR/USD',
      message: 'EUR/USD volatility spike detected',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  
  res.json(alerts);
});

// Mark alert as read
router.put('/alerts/:id/read', (req, res) => {
  const { id } = req.params;
  
  // In production, this would update the database
  res.json({ message: 'Alert marked as read' });
});

module.exports = router;