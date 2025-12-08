// backend/src/utils/database.js - OPTIMIZED FOR 1M RECORDS
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sales.db');

// Optimize for production with larger memory
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

console.log("✓ SQLite DB ready at:", dbPath);

// Production-optimized pragmas
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -128000'); // 128MB cache for large datasets
db.pragma('temp_store = MEMORY');
db.pragma('mmap_size = 268435456'); // 256MB memory-mapped I/O
db.pragma('page_size = 8192'); // Larger page size for bulk operations

let insertStmt = null;

function initializeDatabase() {
  // Create main sales table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      phoneNumber TEXT,
      gender TEXT,
      age INTEGER,
      customerRegion TEXT,
      customerType TEXT,
      productId TEXT NOT NULL,
      productName TEXT,
      brand TEXT,
      productCategory TEXT,
      tags TEXT,
      quantity INTEGER DEFAULT 0,
      pricePerUnit REAL DEFAULT 0,
      discountPercentage REAL DEFAULT 0,
      totalAmount REAL DEFAULT 0,
      finalAmount REAL DEFAULT 0,
      date TEXT,
      paymentMethod TEXT,
      orderStatus TEXT,
      deliveryType TEXT,
      storeId TEXT,
      storeLocation TEXT,
      salespersonId TEXT,
      employeeName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Optimized indexes for 1M records
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_customer_name ON sales(customerName COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_phone ON sales(phoneNumber);
    CREATE INDEX IF NOT EXISTS idx_customer_region ON sales(customerRegion);
    CREATE INDEX IF NOT EXISTS idx_product_category ON sales(productCategory);
    CREATE INDEX IF NOT EXISTS idx_payment_method ON sales(paymentMethod);
    CREATE INDEX IF NOT EXISTS idx_date ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_final_amount ON sales(finalAmount);
    CREATE INDEX IF NOT EXISTS idx_composite_filter ON sales(customerRegion, productCategory, date);
  `);

  // Initialize prepared statement
  insertStmt = db.prepare(`
    INSERT INTO sales (
      customerId, customerName, phoneNumber, gender, age, customerRegion, customerType,
      productId, productName, brand, productCategory, tags, quantity, pricePerUnit,
      discountPercentage, totalAmount, finalAmount, date, paymentMethod, orderStatus,
      deliveryType, storeId, storeLocation, salespersonId, employeeName
    ) VALUES (
      @customerId, @customerName, @phoneNumber, @gender, @age, @customerRegion, @customerType,
      @productId, @productName, @brand, @productCategory, @tags, @quantity, @pricePerUnit,
      @discountPercentage, @totalAmount, @finalAmount, @date, @paymentMethod, @orderStatus,
      @deliveryType, @storeId, @storeLocation, @salespersonId, @employeeName
    )
  `);

  console.log('✓ Database schema initialized');
}

function insertRecord(record) {
  if (!insertStmt) {
    throw new Error('Database not initialized');
  }
  
  let dateValue = null;
  if (record.date) {
    if (record.date instanceof Date && !isNaN(record.date.getTime())) {
      dateValue = record.date.toISOString().split('T')[0];
    } else if (typeof record.date === 'string') {
      dateValue = record.date;
    }
  }
  
  return insertStmt.run({
    ...record,
    date: dateValue
  });
}

function insertRecords(records) {
  if (!insertStmt) {
    throw new Error('Database not initialized');
  }
  
  // Use transaction for batch inserts
  const insertMany = db.transaction((records) => {
    for (const record of records) {
      insertRecord(record);
    }
  });
  
  insertMany(records);
}

function getRecordCount() {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM sales').get();
    return result ? result.count : 0;
  } catch (error) {
    console.error('Error getting record count:', error);
    return 0;
  }
}

function clearDatabase() {
  db.exec('DELETE FROM sales');
  db.exec('VACUUM');
  console.log('✓ Database cleared');
}

function closeDatabase() {
  try {
    if (insertStmt) {
      insertStmt.finalize();
    }
    db.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
}

// Optimized query with EXPLAIN QUERY PLAN support
function queryRecords({ search, filters, sortBy, sortOrder, page, pageSize }) {
  let query = 'SELECT * FROM sales WHERE 1=1';
  const params = [];

  // Search implementation
  if (search && search.trim() !== '') {
    query += ` AND (customerName LIKE ? OR phoneNumber LIKE ?)`;
    const searchPattern = `%${search.trim()}%`;
    params.push(searchPattern, searchPattern);
  }

  // Filters
  if (filters.customerRegion?.length > 0) {
    const placeholders = filters.customerRegion.map(() => '?').join(',');
    query += ` AND customerRegion IN (${placeholders})`;
    params.push(...filters.customerRegion);
  }

  if (filters.gender?.length > 0) {
    const placeholders = filters.gender.map(() => '?').join(',');
    query += ` AND gender IN (${placeholders})`;
    params.push(...filters.gender);
  }

  if (filters.ageMin != null) {
    query += ` AND age >= ?`;
    params.push(filters.ageMin);
  }
  if (filters.ageMax != null) {
    query += ` AND age <= ?`;
    params.push(filters.ageMax);
  }

  if (filters.productCategory?.length > 0) {
    const placeholders = filters.productCategory.map(() => '?').join(',');
    query += ` AND productCategory IN (${placeholders})`;
    params.push(...filters.productCategory);
  }

  if (filters.tags?.length > 0) {
    const tagConditions = filters.tags.map(() => 'tags LIKE ?').join(' OR ');
    query += ` AND (${tagConditions})`;
    params.push(...filters.tags.map(tag => `%${tag}%`));
  }

  if (filters.paymentMethod?.length > 0) {
    const placeholders = filters.paymentMethod.map(() => '?').join(',');
    query += ` AND paymentMethod IN (${placeholders})`;
    params.push(...filters.paymentMethod);
  }

  if (filters.dateFrom) {
    query += ` AND date >= ?`;
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    query += ` AND date <= ?`;
    params.push(filters.dateTo);
  }

  // Sorting
  const sortColumn = sortBy === 'customerName' ? 'customerName COLLATE NOCASE' : sortBy;
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order}`;

  // Pagination
  query += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, (page - 1) * pageSize);

  return db.prepare(query).all(...params);
}

function getFilteredCount({ search, filters }) {
  let query = 'SELECT COUNT(*) as count FROM sales WHERE 1=1';
  const params = [];

  if (search?.trim()) {
    query += ` AND (customerName LIKE ? OR phoneNumber LIKE ?)`;
    const searchPattern = `%${search.trim()}%`;
    params.push(searchPattern, searchPattern);
  }

  if (filters.customerRegion?.length > 0) {
    query += ` AND customerRegion IN (${filters.customerRegion.map(() => '?').join(',')})`;
    params.push(...filters.customerRegion);
  }

  if (filters.gender?.length > 0) {
    query += ` AND gender IN (${filters.gender.map(() => '?').join(',')})`;
    params.push(...filters.gender);
  }

  if (filters.ageMin != null) {
    query += ` AND age >= ?`;
    params.push(filters.ageMin);
  }
  if (filters.ageMax != null) {
    query += ` AND age <= ?`;
    params.push(filters.ageMax);
  }

  if (filters.productCategory?.length > 0) {
    query += ` AND productCategory IN (${filters.productCategory.map(() => '?').join(',')})`;
    params.push(...filters.productCategory);
  }

  if (filters.tags?.length > 0) {
    const tagConditions = filters.tags.map(() => 'tags LIKE ?').join(' OR ');
    query += ` AND (${tagConditions})`;
    params.push(...filters.tags.map(tag => `%${tag}%`));
  }

  if (filters.paymentMethod?.length > 0) {
    query += ` AND paymentMethod IN (${filters.paymentMethod.map(() => '?').join(',')})`;
    params.push(...filters.paymentMethod);
  }

  if (filters.dateFrom) {
    query += ` AND date >= ?`;
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    query += ` AND date <= ?`;
    params.push(filters.dateTo);
  }

  const result = db.prepare(query).get(...params);
  return result?.count || 0;
}

// Cached filter options
let cachedFilterOptions = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getFilterOptions() {
  // Use cache if available and fresh
  if (cachedFilterOptions && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    return cachedFilterOptions;
  }

  try {
    const options = {
      customerRegions: db.prepare('SELECT DISTINCT customerRegion FROM sales WHERE customerRegion IS NOT NULL AND customerRegion != ? ORDER BY customerRegion')
        .all('').map(r => r.customerRegion),
      
      genders: db.prepare('SELECT DISTINCT gender FROM sales WHERE gender IS NOT NULL AND gender != ? ORDER BY gender')
        .all('').map(r => r.gender),
      
      productCategories: db.prepare('SELECT DISTINCT productCategory FROM sales WHERE productCategory IS NOT NULL AND productCategory != ? ORDER BY productCategory')
        .all('').map(r => r.productCategory),
      
      paymentMethods: db.prepare('SELECT DISTINCT paymentMethod FROM sales WHERE paymentMethod IS NOT NULL AND paymentMethod != ? ORDER BY paymentMethod')
        .all('').map(r => r.paymentMethod),
      
      ageRange: db.prepare('SELECT MIN(age) as min, MAX(age) as max FROM sales WHERE age IS NOT NULL').get() || { min: 0, max: 100 },
      
      dateRange: db.prepare('SELECT MIN(date) as min, MAX(date) as max FROM sales WHERE date IS NOT NULL').get() || { min: null, max: null }
    };

    cachedFilterOptions = options;
    cacheTimestamp = Date.now();
    return options;
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    throw error;
  }
}

function getAllTags() {
  try {
    const records = db.prepare('SELECT DISTINCT tags FROM sales WHERE tags IS NOT NULL AND tags != ?').all('');
    const tagsSet = new Set();
    
    records.forEach(record => {
      if (record.tags) {
        record.tags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tagsSet.add(trimmed);
        });
      }
    });
    
    return Array.from(tagsSet).sort();
  } catch (error) {
    console.error('Error in getAllTags:', error);
    throw error;
  }
}

function getStatistics() {
  try {
    return db.prepare(`
      SELECT 
        COUNT(*) as totalTransactions,
        COALESCE(SUM(finalAmount), 0) as totalRevenue,
        COALESCE(AVG(finalAmount), 0) as averageOrderValue,
        COALESCE(SUM(quantity), 0) as totalQuantitySold,
        COUNT(DISTINCT customerId) as uniqueCustomers,
        COUNT(DISTINCT productId) as uniqueProducts
      FROM sales
    `).get();
  } catch (error) {
    console.error('Error in getStatistics:', error);
    throw error;
  }
}

export {
  db,
  initializeDatabase,
  insertRecord,
  insertRecords,
  getRecordCount,
  clearDatabase,
  closeDatabase,
  queryRecords,
  getFilteredCount,
  getFilterOptions,
  getAllTags,
  getStatistics
};