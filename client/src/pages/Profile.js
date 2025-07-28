import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiBell, FiClock, FiShield, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, subscription, updateUser, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('/api/users/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleTimezoneChange = async (timezone) => {
    setLoading(true);
    try {
      await updateUser({ timezone });
    } catch (error) {
      console.error('Error updating timezone:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (preference, value) => {
    setLoading(true);
    try {
      await updatePreferences({ [preference]: value });
    } catch (error) {
      console.error('Error updating preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsRead = async (alertId) => {
    try {
      await axios.put(`/api/users/alerts/${alertId}/read`);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  return (
    <div className="profile-page">
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
              <h1 className="text-gradient">Profile & Settings</h1>
              <p className="subtitle">Manage your account and preferences</p>
            </div>
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
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser />
              Profile
            </button>
            <button
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <FiSettings />
              Preferences
            </button>
            <button
              className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              <FiBell />
              Alerts
            </button>
            <button
              className={`tab ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              <FiCreditCard />
              Subscription
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
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-grid">
                <div className="profile-card card">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <FiUser />
                    </div>
                    <div className="profile-info">
                      <h3>{user?.name || 'Demo User'}</h3>
                      <p>{user?.email || 'demo@example.com'}</p>
                      <span className="subscription-badge">
                        {subscription?.plan || 'Free'} Plan
                      </span>
                    </div>
                  </div>
                  
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="label">Timezone:</span>
                      <select 
                        value={user?.timezone || 'UTC'}
                        onChange={(e) => handleTimezoneChange(e.target.value)}
                        disabled={loading}
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Member Since:</span>
                      <span className="value">January 2024</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">Last Login:</span>
                      <span className="value">Today</span>
                    </div>
                  </div>
                </div>

                <div className="stats-card card">
                  <h3>Account Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">127</div>
                      <div className="stat-label">Sessions Tracked</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">23</div>
                      <div className="stat-label">Alerts Set</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">85%</div>
                      <div className="stat-label">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-section">
              <h2>Preferences</h2>
              <div className="preferences-grid">
                <div className="preference-card card">
                  <h3>Notification Settings</h3>
                  <div className="preference-item">
                    <div className="preference-info">
                      <span className="preference-label">Email Alerts</span>
                      <span className="preference-description">Receive email notifications for important events</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={user?.preferences?.alerts || false}
                        onChange={(e) => handlePreferenceChange('alerts', e.target.checked)}
                        disabled={loading}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="preference-item">
                    <div className="preference-info">
                      <span className="preference-label">Push Notifications</span>
                      <span className="preference-description">Receive push notifications on your device</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={user?.preferences?.notifications || false}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        disabled={loading}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="preference-card card">
                  <h3>Trading Preferences</h3>
                  <div className="preference-item">
                    <div className="preference-info">
                      <span className="preference-label">Default Session</span>
                      <span className="preference-description">Choose your preferred trading session</span>
                    </div>
                    <select 
                      value={user?.preferences?.defaultSession || 'london'}
                      onChange={(e) => handlePreferenceChange('defaultSession', e.target.value)}
                      disabled={loading}
                    >
                      <option value="sydney">Sydney</option>
                      <option value="tokyo">Tokyo</option>
                      <option value="london">London</option>
                      <option value="newyork">New York</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-section">
              <h2>Recent Alerts</h2>
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className={`alert-item card ${alert.read ? 'read' : 'unread'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="alert-content">
                      <div className="alert-header">
                        <span className="alert-type">
                          {alert.type === 'session_open' ? '🕐' : 
                           alert.type === 'volatility_spike' ? '📊' : '📰'}
                        </span>
                        <span className="alert-message">{alert.message}</span>
                        {!alert.read && (
                          <span className="unread-badge">New</span>
                        )}
                      </div>
                      <div className="alert-time">
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    {!alert.read && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </motion.div>
                ))}
                
                {alerts.length === 0 && (
                  <div className="empty-state card">
                    <FiBell className="empty-icon" />
                    <h3>No Alerts</h3>
                    <p>You don't have any alerts yet. They will appear here when you receive notifications.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="subscription-section">
              <h2>Subscription Management</h2>
              <div className="subscription-grid">
                <div className="subscription-card card">
                  <div className="subscription-header">
                    <h3>Current Plan</h3>
                    <span className={`plan-badge ${subscription?.plan}`}>
                      {subscription?.plan || 'Free'}
                    </span>
                  </div>
                  
                  <div className="subscription-details">
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className={`value status-${subscription?.status}`}>
                        {subscription?.status || 'Active'}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Start Date:</span>
                      <span className="value">{subscription?.startDate || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">End Date:</span>
                      <span className="value">{subscription?.endDate || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Auto Renew:</span>
                      <span className="value">
                        {subscription?.autoRenew ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="subscription-actions">
                    <button className="btn btn-secondary">Manage Subscription</button>
                    <button className="btn btn-primary">Upgrade Plan</button>
                  </div>
                </div>

                <div className="features-card card">
                  <h3>Your Features</h3>
                  <div className="features-list">
                    {subscription?.features?.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <FiCheck className="check-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;