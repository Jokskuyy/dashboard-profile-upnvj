import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import analyticsRoutes from './routes/analytics.js';
import { initData } from './utils/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize data files
initData();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'UPNVJ Dashboard API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🎓 UPNVJ Dashboard API Server');
  console.log('='.repeat(60));
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
  console.log('📍 API Endpoints:');
  console.log('   Auth:');
  console.log('     POST   /api/auth/login');
  console.log('     POST   /api/auth/logout');
  console.log('     GET    /api/auth/verify');
  console.log('     GET    /api/auth/profile');
  console.log('   Analytics:');
  console.log('     POST   /api/track/pageview');
  console.log('     POST   /api/track/event');
  console.log('     GET    /api/stats');
  console.log('     GET    /api/analytics');
  console.log('='.repeat(60));
});
