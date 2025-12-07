// backend/src/utils/dataLoader.js
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

// ⭐ Direct download link - Google Drive
const datasetURL = "https://www.dropbox.com/scl/fi/vdoovyzfpgm2d2k6yxz5w/truestate_assignment_dataset.csv?rlkey=zt63myzyibflct8nlplpmtp2k&st=zvx4qlaf&dl=0";

const tempDatasetPath = path.join(__dirname, "../../data/cloud_dataset.csv");

// ⭐ FIXED Google Drive redirect + token handling
async function downloadDataset(url, dest) {
  return new Promise((resolve, reject) => {
    console.log("⟳ Connecting to Google Drive...");

    https.get(url, (res) => {
      // Handle large file redirect
      if (res.statusCode === 302 || res.headers.location) {
        console.log("⟳ Following redirect...");
        return downloadDataset(res.headers.location, dest)
          .then(resolve).catch(reject);
      }

      // Google Drive returns HTML page instead of file if blocked
      if (res.headers['content-type'].includes("text/html")) {
        return reject("❌ Google Drive blocked download - file too large or login required");
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          console.log("✓ Dataset downloaded successfully!");
          resolve(dest);
        });
      });

      file.on("error", reject);
    }).on("error", reject);
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
    } else if (camelKey === 'date') {
      const parsed = new Date(value);
      normalized[camelKey] = isNaN(parsed.getTime()) ? null : parsed;
    } else {
      normalized[camelKey] = value ? String(value).trim() : '';
    }
  }
  return normalized;
}

async function loadDataset(forceReload = false) {
  try {
    initializeDatabase();

    const existingCount = getRecordCount();
    if (existingCount > 0 && !forceReload) {
      console.log(`✓ Database already contains ${existingCount} records`);
      return existingCount;
    }

    if (forceReload && existingCount > 0) {
      console.log("⟳ Clearing existing data...");
      clearDatabase();
    }

    // Download CSV
    await downloadDataset(datasetURL, tempDatasetPath);

    console.log(`⟳ Parsing dataset...`);

    return new Promise((resolve, reject) => {
      const batchSize = 1000;
      let batch = [];
      let totalProcessed = 0;
      let errorCount = 0;
      const startTime = Date.now();

      fs.createReadStream(tempDatasetPath)
        .pipe(csv())
        .on('data', (data) => {
          try {
            const normalized = normalizeRecord(data);
            batch.push(normalized);

            if (batch.length >= batchSize) {
              insertRecords(batch);
              totalProcessed += batch.length;
              batch = [];

              if (totalProcessed % 10000 === 0) {
                console.log(`⟳ ${totalProcessed.toLocaleString()} records processed...`);
              }
            }
          } catch (err) {
            errorCount++;
          }
        })
        .on('end', () => {
          if (batch.length > 0) {
            insertRecords(batch);
            totalProcessed += batch.length;
          }

          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✓ Loaded ${totalProcessed.toLocaleString()} records in ${duration}s`);
          resolve(totalProcessed);
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error("✗ Load failed:", error);
    throw error;
  }
}

export { loadDataset, normalizeRecord };
