import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import { loadDataset } from "./utils/dataLoader.js";
import {
  getAllRecords,
  getRecordCount,
  getRecordsByCustomer,
  getRecordsByDateRange,
  getRecordsByCategory,
  searchRecords,
  getSalesByCategory,
  getSalesByRegion,
  getTopProducts,
  closeDatabase
} from "./utils/database.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load dataset on startup (only if database is empty)
loadDataset()
  .then((count) => {
    console.log(`Database ready with ${count} records`);
  })
  .catch((err) => {
    console.error('Error loading dataset:', err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Sales API - Database loaded");
});

app.get('/health', (req, res) => {
  try {
    const count = getRecordCount();
    res.json({ 
      status: "OK", 
      recordCount: count 
    });
  } catch (err) {
    res.status(500).json({ 
      status: "ERROR", 
      message: err.message 
    });
  }
});

// Get all records with pagination
app.get('/api/records', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const records = getAllRecords(limit, offset);
    const total = getRecordCount();
    
    res.json({
      data: records,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get record count
app.get('/api/records/count', (req, res) => {
  try {
    const count = getRecordCount();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get records by customer ID
app.get('/api/customers/:customerId/records', (req, res) => {
  try {
    const records = getRecordsByCustomer(req.params.customerId);
    res.json({ data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get records by date range
app.get('/api/records/date-range', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'startDate and endDate are required' 
      });
    }
    
    const records = getRecordsByDateRange(startDate, endDate);
    res.json({ data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get records by category
app.get('/api/categories/:category/records', (req, res) => {
  try {
    const records = getRecordsByCategory(req.params.category);
    res.json({ data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Advanced search with filters
app.post('/api/records/search', (req, res) => {
  try {
    const filters = req.body;
    const records = searchRecords(filters);
    
    res.json({ 
      data: records,
      filters: filters 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics endpoints
app.get('/api/analytics/by-category', (req, res) => {
  try {
    const data = getSalesByCategory();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/by-region', (req, res) => {
  try {
    const data = getSalesByRegion();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/top-products', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = getTopProducts(limit);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database...');
  closeDatabase();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});