const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// Get all session information
router.get('/', (req, res) => {
  const sessions = {
    sydney: {
      name: 'Sydney',
      timezone: 'Australia/Sydney',
      openTime: '22:00',
      closeTime: '07:00',
      pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY', 'NZD/JPY'],
      description: 'Sydney session is known for lower volatility and is often used for position building.',
      color: '#FF6B6B'
    },
    tokyo: {
      name: 'Tokyo',
      timezone: 'Asia/Tokyo',
      openTime: '00:00',
      closeTime: '09:00',
      pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY'],
      description: 'Tokyo session features the Japanese Yen pairs and moderate volatility.',
      color: '#4ECDC4'
    },
    london: {
      name: 'London',
      timezone: 'Europe/London',
      openTime: '08:00',
      closeTime: '17:00',
      pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'USD/CHF'],
      description: 'London session is the most liquid and volatile session, accounting for 30% of daily volume.',
      color: '#45B7D1'
    },
    newyork: {
      name: 'New York',
      timezone: 'America/New_York',
      openTime: '13:00',
      closeTime: '22:00',
      pairs: ['USD/CAD', 'EUR/USD', 'GBP/USD', 'USD/CHF'],
      description: 'New York session overlaps with London, creating the most volatile period.',
      color: '#96CEB4'
    }
  };

  res.json(sessions);
});

// Get current session status
router.get('/status', (req, res) => {
  const now = new Date();
  const sessions = {};

  const sessionData = {
    sydney: { timezone: 'Australia/Sydney', openTime: '22:00', closeTime: '07:00' },
    tokyo: { timezone: 'Asia/Tokyo', openTime: '00:00', closeTime: '09:00' },
    london: { timezone: 'Europe/London', openTime: '08:00', closeTime: '17:00' },
    newyork: { timezone: 'America/New_York', openTime: '13:00', closeTime: '22:00' }
  };

  Object.keys(sessionData).forEach(sessionKey => {
    const session = sessionData[sessionKey];
    const sessionTime = moment().tz(session.timezone);
    
    const [openHour, openMin] = session.openTime.split(':').map(Number);
    const [closeHour, closeMin] = session.closeTime.split(':').map(Number);
    
    const openTime = moment().tz(session.timezone).set({ hour: openHour, minute: openMin, second: 0 });
    const closeTime = moment().tz(session.timezone).set({ hour: closeHour, minute: closeMin, second: 0 });
    
    // Handle sessions that span midnight
    if (closeTime.isBefore(openTime)) {
      closeTime.add(1, 'day');
    }
    
    let status = 'closed';
    if (sessionTime.isBetween(openTime, closeTime, null, '[)')) {
      status = 'open';
    } else if (sessionTime.isBefore(openTime)) {
      status = 'upcoming';
    }
    
    sessions[sessionKey] = {
      status,
      currentTime: sessionTime.format('HH:mm:ss'),
      timeUntilOpen: status === 'upcoming' ? openTime.diff(sessionTime) : null,
      timeUntilClose: status === 'open' ? closeTime.diff(sessionTime) : null
    };
  });

  res.json(sessions);
});

// Get session overlaps
router.get('/overlaps', (req, res) => {
  const now = new Date();
  const overlaps = [];
  
  const sessions = [
    { name: 'Sydney', timezone: 'Australia/Sydney', openTime: '22:00', closeTime: '07:00' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', openTime: '00:00', closeTime: '09:00' },
    { name: 'London', timezone: 'Europe/London', openTime: '08:00', closeTime: '17:00' },
    { name: 'New York', timezone: 'America/New_York', openTime: '13:00', closeTime: '22:00' }
  ];

  // Check for overlaps
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const session1 = sessions[i];
      const session2 = sessions[j];
      
      const time1 = moment().tz(session1.timezone);
      const time2 = moment().tz(session2.timezone);
      
      const [open1Hour, open1Min] = session1.openTime.split(':').map(Number);
      const [close1Hour, close1Min] = session1.closeTime.split(':').map(Number);
      const [open2Hour, open2Min] = session2.openTime.split(':').map(Number);
      const [close2Hour, close2Min] = session2.closeTime.split(':').map(Number);
      
      const open1 = moment().tz(session1.timezone).set({ hour: open1Hour, minute: open1Min });
      const close1 = moment().tz(session1.timezone).set({ hour: close1Hour, minute: close1Min });
      const open2 = moment().tz(session2.timezone).set({ hour: open2Hour, minute: open2Min });
      const close2 = moment().tz(session2.timezone).set({ hour: close2Hour, minute: close2Min });
      
      if (close1.isBefore(open1)) close1.add(1, 'day');
      if (close2.isBefore(open2)) close2.add(1, 'day');
      
      // Check if sessions overlap
      if (open1.isBefore(close2) && open2.isBefore(close1)) {
        overlaps.push({
          session1: session1.name,
          session2: session2.name,
          overlapStart: moment.max(open1, open2).format('HH:mm'),
          overlapEnd: moment.min(close1, close2).format('HH:mm')
        });
      }
    }
  }

  res.json(overlaps);
});

module.exports = router;