const express = require('express');
const router = express.Router();

// Mock subscription plans
const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Live Forex session clock',
      'Basic session information',
      'Educational tooltips',
      'Session status updates'
    ],
    limitations: [
      'No trading recommendations',
      'No volatility scores',
      'No alerts',
      'No AI planner'
    ]
  },
  premium: {
    name: 'Premium',
    price: 29.99,
    interval: 'monthly',
    features: [
      'All Free features',
      'Smart pair recommendations',
      'Session-specific volatility scores',
      'Trading alerts and notifications',
      'AI-powered session planner',
      'Mini trade strategy tips',
      'Priority support'
    ],
    limitations: []
  },
  pro: {
    name: 'Pro',
    price: 99.99,
    interval: 'monthly',
    features: [
      'All Premium features',
      'MetaTrader/TradingView integration',
      'Advanced analytics',
      'Custom alerts',
      'API access',
      'Dedicated support'
    ],
    limitations: []
  }
};

// Get available subscription plans
router.get('/plans', (req, res) => {
  res.json(subscriptionPlans);
});

// Get current subscription status
router.get('/status', (req, res) => {
  // Mock user subscription status
  const subscription = {
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    autoRenew: true,
    features: subscriptionPlans.premium.features
  };
  
  res.json(subscription);
});

// Create subscription (mock Stripe integration)
router.post('/create', (req, res) => {
  const { plan, paymentMethod } = req.body;
  
  if (!subscriptionPlans[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }
  
  // Mock successful subscription creation
  const subscription = {
    id: 'sub_' + Math.random().toString(36).substr(2, 9),
    plan,
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    autoRenew: true
  };
  
  res.json({
    message: 'Subscription created successfully',
    subscription
  });
});

// Cancel subscription
router.post('/cancel', (req, res) => {
  // Mock subscription cancellation
  res.json({
    message: 'Subscription cancelled successfully',
    subscription: {
      status: 'cancelled',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

// Update subscription
router.put('/update', (req, res) => {
  const { plan } = req.body;
  
  if (!subscriptionPlans[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }
  
  res.json({
    message: 'Subscription updated successfully',
    subscription: {
      plan,
      status: 'active',
      features: subscriptionPlans[plan].features
    }
  });
});

// Get billing history
router.get('/billing', (req, res) => {
  const billingHistory = [
    {
      id: 'inv_001',
      date: '2024-01-01',
      amount: 29.99,
      status: 'paid',
      plan: 'premium'
    },
    {
      id: 'inv_002',
      date: '2024-02-01',
      amount: 29.99,
      status: 'paid',
      plan: 'premium'
    }
  ];
  
  res.json(billingHistory);
});

// Check feature access
router.get('/check/:feature', (req, res) => {
  const { feature } = req.params;
  const userPlan = 'premium'; // Mock user plan
  
  const hasAccess = subscriptionPlans[userPlan].features.includes(feature);
  
  res.json({
    feature,
    hasAccess,
    plan: userPlan
  });
});

module.exports = router;