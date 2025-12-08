// backend/src/server.js - PRODUCTION VERSION
import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';
import { loadDatasetAsync, getLoadingStatus, isDataReady } from './utils/dataLoader.js';
import { initializeDatabase, getRecordCount } from './utils/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://retail-sales-management-system-two.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// Initialize database schema immediately (fast)
initializeDatabase();

// Health check endpoint - always responds
app.get('/health', (req, res) => {
  const recordCount = getRecordCount();
  res.json({ 
    status: 'ok',
    dataReady: recordCount > 0,
    recordCount,
    timestamp: new Date().toISOString()
  });
});

// Loading status endpoint
app.get('/api/loading-status', (req, res) => {
  res.json(getLoadingStatus());
});

// Trigger data load endpoint (admin only)
app.post('/api/load-data', async (req, res) => {
  const { forceReload = false } = req.body;
  
  try {
    // Start async load
    loadDatasetAsync(forceReload).catch(err => {
      console.error('Background load error:', err);
    });
    
    res.json({ 
      message: 'Data loading started in background',
      status: getLoadingStatus()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to start data loading',
      message: error.message 
    });
  }
});

// Middleware to check if data is ready
function requireDataReady(req, res, next) {
  if (!isDataReady()) {
    return res.status(503).json({
      error: 'Data not ready',
      message: 'Dataset is still loading. Please check /api/loading-status',
      loadingStatus: getLoadingStatus()
    });
  }
  next();
}

// Apply data check to sales routes
app.use('/api/sales', requireDataReady, salesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server IMMEDIATELY (don't wait for data)
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Loading status: http://localhost:${PORT}/api/loading-status`);
  
  // Check if data exists
  const existingCount = getRecordCount();
  
  if (existingCount === 0) {
    console.log('\n⚠ No data found. Starting background load...');
    console.log('API will be available once loading completes.\n');
    
    // Start loading in background (non-blocking)
    loadDatasetAsync(false).catch(err => {
      console.error('Failed to load dataset:', err.message);
      console.error('You can retry with: POST /api/load-data');
    });
  } else {
    console.log(`✓ Database ready with ${existingCount.toLocaleString()} records`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;