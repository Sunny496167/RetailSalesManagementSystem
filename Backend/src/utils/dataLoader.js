// backend/src/utils/dataLoader.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { 
  initializeDatabase, 
  insertRecords, 
  getRecordCount,
  clearDatabase 
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    // Handle numeric fields
    if (['age', 'quantity', 'pricePerUnit', 'discountPercentage', 'totalAmount', 'finalAmount'].includes(camelKey)) {
      normalized[camelKey] = value ? parseFloat(value) : 0;
    } 
    // Handle date field
    else if (camelKey === 'date') {
      if (value) {
        const parsed = new Date(value);
        normalized[camelKey] = isNaN(parsed.getTime()) ? null : parsed;
      } else {
        normalized[camelKey] = null;
      }
    }
    // Handle string fields
    else {
      normalized[camelKey] = value ? String(value).trim() : '';
    }
  }
  
  return normalized;
}

async function loadDataset(forceReload = false) {
  try {
    // Initialize database schema
    initializeDatabase();
    
    // Check if data already exists
    const existingCount = getRecordCount();
    
    if (existingCount > 0 && !forceReload) {
      console.log(`✓ Database already contains ${existingCount} records`);
      return existingCount;
    }
    
    if (forceReload && existingCount > 0) {
      console.log('⟳ Clearing existing data...');
      clearDatabase();
    }
    
    // Try multiple possible CSV paths
    const possiblePaths = [
      path.join(__dirname, '../../data/truestate_assignment_dataset.csv'),
      path.join(__dirname, '../../data/sales_data.csv'),
      path.join(__dirname, '../../data/dataset.csv')
    ];
    
    let csvPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        csvPath = testPath;
        break;
      }
    }
    
    if (!csvPath) {
      throw new Error('CSV file not found. Please place it in backend/data/ directory');
    }
    
    console.log(`⟳ Loading data from: ${path.basename(csvPath)}`);
    
    return new Promise((resolve, reject) => {
      const batchSize = 1000;
      let batch = [];
      let totalProcessed = 0;
      let errorCount = 0;
      
      const startTime = Date.now();
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          try {
            const normalized = normalizeRecord(data);
            batch.push(normalized);
            
            // Insert batch when it reaches batchSize
            if (batch.length >= batchSize) {
              insertRecords(batch);
              totalProcessed += batch.length;
              
              // Progress indicator every 10k records
              if (totalProcessed % 10000 === 0) {
                console.log(`  ⟳ Processed ${totalProcessed.toLocaleString()} records...`);
              }
              
              batch = [];
            }
          } catch (err) {
            errorCount++;
            if (errorCount <= 5) {
              console.error('  ⚠ Error processing record:', err.message);
            }
          }
        })
        .on('end', () => {
          // Insert remaining records
          if (batch.length > 0) {
            insertRecords(batch);
            totalProcessed += batch.length;
          }
          
          const endTime = Date.now();
          const duration = ((endTime - startTime) / 1000).toFixed(2);
          
          console.log(`✓ Loaded ${totalProcessed.toLocaleString()} records in ${duration}s`);
          if (errorCount > 0) {
            console.log(`  ⚠ ${errorCount} records had errors and were skipped`);
          }
          
          resolve(totalProcessed);
        })
        .on('error', (err) => {
          console.error('✗ CSV parsing error:', err);
          reject(err);
        });
    });
    
  } catch (error) {
    console.error('✗ Error loading dataset:', error.message);
    throw error;
  }
}

export { loadDataset, normalizeRecord };