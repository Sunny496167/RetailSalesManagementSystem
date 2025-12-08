// backend/src/utils/dataLoader.js - PRODUCTION-READY VERSION
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import https from 'https';
import { fileURLToPath } from 'url';
import { 
  initializeDatabase, 
  insertRecords, 
  getRecordCount,
  clearDatabase 
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetURL = "https://www.dropbox.com/scl/fi/vdoovyzfpgm2d2k6yxz5w/truestate_assignment_dataset.csv?rlkey=zt63myzyibflct8nlplpmtp2k&st=zvx4qlaf&dl=1";
const tempDatasetPath = path.join(__dirname, "../../data/cloud_dataset.csv");

// Track loading state
let isLoading = false;
let loadingProgress = {
  status: 'idle', // idle, downloading, parsing, loading, completed, error
  recordsProcessed: 0,
  totalRecords: 0,
  error: null,
  startTime: null
};

// Download with timeout and retry logic
async function downloadDataset(url, dest, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`⟳ Download attempt ${attempt}/${retries}...`);
      await downloadWithTimeout(url, dest, 60000); // 60s timeout
      return dest;
    } catch (error) {
      console.error(`✗ Download attempt ${attempt} failed:`, error.message);
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
    }
  }
}

function downloadWithTimeout(url, dest, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      req.destroy();
      reject(new Error(`Download timeout after ${timeout}ms`));
    }, timeout);

    const req = https.get(url, {
      timeout: timeout,
      headers: {
        'User-Agent': 'Node.js'
      }
    }, (res) => {
      clearTimeout(timer);

      // Handle redirects
      if (res.statusCode === 302 || res.statusCode === 301) {
        if (res.headers.location) {
          console.log("⟳ Following redirect...");
          return downloadWithTimeout(res.headers.location, dest, timeout)
            .then(resolve)
            .catch(reject);
        }
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const file = fs.createWriteStream(dest);
      let downloaded = 0;
      const totalSize = parseInt(res.headers['content-length'] || '0');

      res.on('data', (chunk) => {
        downloaded += chunk.length;
        if (totalSize > 0 && downloaded % 1000000 === 0) {
          const percent = ((downloaded / totalSize) * 100).toFixed(1);
          console.log(`⟳ Downloaded ${percent}%`);
        }
      });

      res.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          console.log("✓ Download complete!");
          resolve(dest);
        });
      });

      file.on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
    });

    req.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

const fieldMapping = {
  'Customer ID': 'customerId',
  'Customer Name': 'customerName',
  'Phone Number': 'phoneNumber',
  'Gender': 'gender',
  'Age': 'age',
  'Customer Region': 'customerRegion',
  'Customer Type': 'customerType',
  'Product ID': 'productId',
  'Product Name': 'productName',
  'Brand': 'brand',
  'Product Category': 'productCategory',
  'Tags': 'tags',
  'Quantity': 'quantity',
  'Price per Unit': 'pricePerUnit',
  'Discount Percentage': 'discountPercentage',
  'Total Amount': 'totalAmount',
  'Final Amount': 'finalAmount',
  'Date': 'date',
  'Payment Method': 'paymentMethod',
  'Order Status': 'orderStatus',
  'Delivery Type': 'deliveryType',
  'Store ID': 'storeId',
  'Store Location': 'storeLocation',
  'Salesperson ID': 'salespersonId',
  'Employee Name': 'employeeName'
};

function normalizeRecord(record) {
  const normalized = {};

  for (const [originalKey, camelKey] of Object.entries(fieldMapping)) {
    const value = record[originalKey];

    if (['age', 'quantity', 'pricePerUnit', 'discountPercentage', 'totalAmount', 'finalAmount'].includes(camelKey)) {
      normalized[camelKey] = value ? parseFloat(value) : 0;
    } 
    else if (camelKey === 'date') {
      const parsed = new Date(value);
      normalized[camelKey] = isNaN(parsed.getTime()) ? null : parsed;
    } else {
      normalized[camelKey] = value ? String(value).trim() : '';
    }
  }

  return normalized;
}

// NON-BLOCKING ASYNC LOAD - runs in background
async function loadDatasetAsync(forceReload = false) {
  if (isLoading) {
    console.log("⚠ Load already in progress");
    return { status: 'loading', progress: loadingProgress };
  }

  try {
    isLoading = true;
    loadingProgress = {
      status: 'checking',
      recordsProcessed: 0,
      totalRecords: 0,
      error: null,
      startTime: Date.now()
    };

    initializeDatabase();

    const existingCount = getRecordCount();
    if (existingCount > 0 && !forceReload) {
      console.log(`✓ Database ready with ${existingCount} records`);
      loadingProgress.status = 'completed';
      loadingProgress.recordsProcessed = existingCount;
      loadingProgress.totalRecords = existingCount;
      isLoading = false;
      return existingCount;
    }

    if (forceReload && existingCount > 0) {
      console.log("⟳ Clearing existing data...");
      clearDatabase();
    }

    // Download phase
    loadingProgress.status = 'downloading';
    await downloadDataset(datasetURL, tempDatasetPath);

    // Parse and load phase
    loadingProgress.status = 'loading';
    console.log("⟳ Parsing dataset...");

    return new Promise((resolve, reject) => {
      const batchSize = 500; // Smaller batches for production
      let batch = [];
      let totalProcessed = 0;
      const startTime = Date.now();

      const stream = fs.createReadStream(tempDatasetPath)
        .pipe(csv())
        .on('data', (data) => {
          try {
            const normalized = normalizeRecord(data);
            batch.push(normalized);

            if (batch.length >= batchSize) {
              // Pause stream while inserting
              stream.pause();
              
              insertRecords(batch);
              totalProcessed += batch.length;
              batch = [];

              loadingProgress.recordsProcessed = totalProcessed;

              if (totalProcessed % 10000 === 0) {
                console.log(`⟳ ${totalProcessed.toLocaleString()} records loaded...`);
              }

              // Resume after small delay to prevent blocking
              setImmediate(() => stream.resume());
            }
          } catch (err) {
            console.error('Error processing record:', err);
          }
        })
        .on('end', () => {
          if (batch.length > 0) {
            insertRecords(batch);
            totalProcessed += batch.length;
          }

          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✓ Loaded ${totalProcessed.toLocaleString()} records in ${duration}s`);

          loadingProgress.status = 'completed';
          loadingProgress.recordsProcessed = totalProcessed;
          loadingProgress.totalRecords = totalProcessed;
          isLoading = false;

          // Cleanup temp file
          fs.unlink(tempDatasetPath, (err) => {
            if (err) console.warn('Could not delete temp file:', err.message);
          });

          resolve(totalProcessed);
        })
        .on('error', (err) => {
          console.error("✗ CSV reading error:", err.message);
          loadingProgress.status = 'error';
          loadingProgress.error = err.message;
          isLoading = false;
          reject(err);
        });
    });

  } catch (error) {
    console.error("✗ Load failed:", error.message);
    loadingProgress.status = 'error';
    loadingProgress.error = error.message;
    isLoading = false;
    throw error;
  }
}

// Get current loading status
function getLoadingStatus() {
  return {
    ...loadingProgress,
    isLoading,
    duration: loadingProgress.startTime 
      ? Math.round((Date.now() - loadingProgress.startTime) / 1000) 
      : 0
  };
}

// Check if data is ready
function isDataReady() {
  const count = getRecordCount();
  return count > 0;
}

export { 
  loadDatasetAsync, 
  getLoadingStatus, 
  isDataReady,
  normalizeRecord 
};