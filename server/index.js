const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import routes
const sessionRoutes = require('./routes/sessions');
const tradingRoutes = require('./routes/trading');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Forex session data
const forexSessions = {
  sydney: {
    name: 'Sydney',
    timezone: 'Australia/Sydney',
    openTime: '22:00', // UTC+10
    closeTime: '07:00', // UTC+10
    pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY', 'NZD/JPY'],
    description: 'Sydney session is known for lower volatility and is often used for position building.',
    color: '#FF6B6B'
  },
  tokyo: {
    name: 'Tokyo',
    timezone: 'Asia/Tokyo',
    openTime: '00:00', // UTC+9
    closeTime: '09:00', // UTC+9
    pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY'],
    description: 'Tokyo session features the Japanese Yen pairs and moderate volatility.',
    color: '#4ECDC4'
  },
  london: {
    name: 'London',
    timezone: 'Europe/London',
    openTime: '08:00', // UTC+0
    closeTime: '17:00', // UTC+0
    pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'USD/CHF'],
    description: 'London session is the most liquid and volatile session, accounting for 30% of daily volume.',
    color: '#45B7D1'
  },
  newyork: {
    name: 'New York',
    timezone: 'America/New_York',
    openTime: '13:00', // UTC-5
    closeTime: '22:00', // UTC-5
    pairs: ['USD/CAD', 'EUR/USD', 'GBP/USD', 'USD/CHF'],
    description: 'New York session overlaps with London, creating the most volatile period.',
    color: '#96CEB4'
  }
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send initial session data
  socket.emit('sessions', forexSessions);

  // Send session updates every minute
  const sessionInterval = setInterval(() => {
    const currentSessions = getCurrentSessions();
    socket.emit('sessionUpdate', currentSessions);
  }, 60000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(sessionInterval);
  });
});

// Helper function to get current session status
function getCurrentSessions() {
  const now = new Date();
  const sessions = {};

  Object.keys(forexSessions).forEach(sessionKey => {
    const session = forexSessions[sessionKey];
    const sessionTime = new Date(now.toLocaleString("en-US", {timeZone: session.timezone}));
    
    // Calculate session status
    const [openHour, openMin] = session.openTime.split(':').map(Number);
    const [closeHour, closeMin] = session.closeTime.split(':').map(Number);
    
    const openTime = new Date(sessionTime);
    openTime.setHours(openHour, openMin, 0, 0);
    
    const closeTime = new Date(sessionTime);
    closeTime.setHours(closeHour, closeMin, 0, 0);
    
    // Handle sessions that span midnight
    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }
    
    let status = 'closed';
    if (sessionTime >= openTime && sessionTime < closeTime) {
      status = 'open';
    } else if (sessionTime < openTime) {
      status = 'upcoming';
    }
    
    sessions[sessionKey] = {
      ...session,
      status,
      currentTime: sessionTime.toLocaleTimeString(),
      timeUntilOpen: status === 'upcoming' ? openTime - sessionTime : null,
      timeUntilClose: status === 'open' ? closeTime - sessionTime : null
    };
  });

  return sessions;
}

// API endpoint to get current sessions
app.get('/api/sessions/current', (req, res) => {
  res.json(getCurrentSessions());
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for real-time updates`);
});

module.exports = { app, io, forexSessions };