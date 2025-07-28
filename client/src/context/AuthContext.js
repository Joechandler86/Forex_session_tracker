import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user data for demo
    const mockUser = {
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
    };

    const mockSubscription = {
      plan: 'premium',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      autoRenew: true,
      features: [
        'All Free features',
        'Smart pair recommendations',
        'Session-specific volatility scores',
        'Trading alerts and notifications',
        'AI-powered session planner',
        'Mini trade strategy tips',
        'Priority support'
      ]
    };

    setUser(mockUser);
    setSubscription(mockSubscription);
    setLoading(false);
  }, []);

  const updateUser = async (userData) => {
    try {
      // In production, this would be an API call
      setUser(prev => ({ ...prev, ...userData }));
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      // In production, this would be an API call
      setUser(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      }));
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }
  };

  const hasFeature = (feature) => {
    if (!subscription) return false;
    return subscription.features.includes(feature);
  };

  const isPremium = () => {
    return subscription?.plan === 'premium' || subscription?.plan === 'pro';
  };

  const value = {
    user,
    subscription,
    loading,
    updateUser,
    updatePreferences,
    hasFeature,
    isPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};