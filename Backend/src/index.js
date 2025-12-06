// backend/src/index.js
import express from 'express';
import cors from 'cors';
import { errorHandler } from './utils/errorHandler.js';
import { loadDataset } from './utils/dataLoader.js';
import { getRecordCount, closeDatabase } from './utils/database.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Load dataset on startup
loadDataset()
  .then((count) => {
    console.log(`✓ Server ready with ${count.toLocaleString()} records`);
  })
  .catch((err) => {
    console.error('✗ Error loading dataset:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/sales', salesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Retail Sales Management API',
    version: '1.0.0',
    endpoints: {
      sales: '/api/sales',
      filterOptions: '/api/sales/filter-options',
      statistics: '/api/sales/stats',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const count = getRecordCount();
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: {
        connected: true,
        recordCount: count
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database error',
      error: err.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler (must be last)
app.use(errorHandler);


// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});