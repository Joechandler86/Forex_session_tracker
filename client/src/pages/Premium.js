import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiZap, FiCrown } from 'react-icons/fi';
import axios from 'axios';
import './Premium.css';

const Premium = () => {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/subscriptions/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planName) => {
    try {
      const response = await axios.post('/api/subscriptions/create', {
        plan: planName,
        paymentMethod: 'card'
      });
      
      // In production, this would redirect to Stripe checkout
      alert(`Subscription to ${planName} created successfully!`);
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error creating subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="premium-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading subscription plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-header"
        >
          <div className="header-content">
            <div>
              <h1 className="text-gradient">Upgrade to Premium</h1>
              <p className="subtitle">Unlock advanced trading tools and insights</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="features-overview"
        >
          <h2>Why Choose Premium?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <FiZap />
              </div>
              <h3>Smart Recommendations</h3>
              <p>AI-powered trading recommendations based on real-time market analysis</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <FiStar />
              </div>
              <h3>Volatility Analysis</h3>
              <p>Session-specific volatility scores and market sentiment analysis</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <FiCrown />
              </div>
              <h3>Trading Strategies</h3>
              <p>Professional trading strategies tailored to each session</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <FiCheck />
              </div>
              <h3>Real-time Alerts</h3>
              <p>Instant notifications for market opportunities and risk events</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="plans-section"
        >
          <h2>Choose Your Plan</h2>
          <div className="plans-grid">
            {Object.entries(plans).map(([planKey, plan], index) => (
              <motion.div
                key={planKey}
                className={`plan-card card ${planKey === 'premium' ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {planKey === 'premium' && (
                  <div className="featured-badge">Most Popular</div>
                )}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    {plan.interval && (
                      <span className="interval">/{plan.interval}</span>
                    )}
                  </div>
                </div>

                <div className="plan-features">
                  <h4>Features:</h4>
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <FiCheck className="check-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations && plan.limitations.length > 0 && (
                  <div className="plan-limitations">
                    <h4>Limitations:</h4>
                    <ul>
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="limitation">
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className={`btn ${planKey === 'premium' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSubscribe(planKey)}
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="testimonials-section"
        >
          <h2>What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card card">
              <div className="testimonial-content">
                <p>"The session tracking and volatility analysis have completely changed my trading approach. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>John Smith</h4>
                  <span>Professional Trader</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card card">
              <div className="testimonial-content">
                <p>"Real-time alerts help me catch opportunities I would have missed. The premium features are worth every penny."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Day Trader</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card card">
              <div className="testimonial-content">
                <p>"The AI recommendations are incredibly accurate. My win rate has improved significantly since upgrading."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <h4>Mike Chen</h4>
                  <span>Forex Trader</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="faq-section"
        >
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item card">
              <h3>Can I cancel my subscription anytime?</h3>
              <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>

            <div className="faq-item card">
              <h3>Is there a free trial?</h3>
              <p>Yes, we offer a 7-day free trial for all premium features. No credit card required to start.</p>
            </div>

            <div className="faq-item card">
              <h3>How accurate are the trading recommendations?</h3>
              <p>Our AI recommendations are based on extensive market analysis and have shown consistent accuracy, but past performance doesn't guarantee future results.</p>
            </div>

            <div className="faq-item card">
              <h3>Do you offer refunds?</h3>
              <p>We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;