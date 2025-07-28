import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Trading from './pages/Trading';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2 className="text-gradient">Forex Session Tracker</h2>
        <p>Loading your trading assistant...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;