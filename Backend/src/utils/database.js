import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/sales.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

let insertStmt = null;

// Create table with indexes
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId TEXT,
      customerName TEXT,
      phoneNumber TEXT,
      gender TEXT,
      age INTEGER,
      customerRegion TEXT,
      customerType TEXT,
      productId TEXT,
      productName TEXT,
      brand TEXT,
      productCategory TEXT,
      tags TEXT,
      quantity INTEGER,
      pricePerUnit REAL,
      discountPercentage REAL,
      totalAmount REAL,
      finalAmount REAL,
      date TEXT,
      paymentMethod TEXT,
      orderStatus TEXT,
      deliveryType TEXT,
      storeId TEXT,
      storeLocation TEXT,
      salespersonId TEXT,
      employeeName TEXT
    )
  `);

  // Create indexes for common queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_customer ON sales(customerId);
    CREATE INDEX IF NOT EXISTS idx_product ON sales(productId);
    CREATE INDEX IF NOT EXISTS idx_date ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_category ON sales(productCategory);
    CREATE INDEX IF NOT EXISTS idx_region ON sales(customerRegion);
    CREATE INDEX IF NOT EXISTS idx_store ON sales(storeId);
  `);

  // Initialize prepared statement after table creation
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

  console.log('Database initialized');
}

function insertRecord(record) {
  if (!insertStmt) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  
  // Safely handle date conversion
  let dateValue = null;
  if (record.date && record.date instanceof Date && !isNaN(record.date.getTime())) {
    dateValue = record.date.toISOString();
  }
  
  return insertStmt.run({
    ...record,
    date: dateValue
  });
}

// Batch insert for better performance
function insertRecords(records) {
  if (!insertStmt) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  
  const insertMany = db.transaction((records) => {
    for (const record of records) {
      insertRecord(record);
    }
  });
  
  insertMany(records);
}

// Query functions
function getAllRecords(limit = 1000, offset = 0) {
  return db.prepare('SELECT * FROM sales LIMIT ? OFFSET ?').all(limit, offset);
}

function getRecordCount() {
  const result = db.prepare('SELECT COUNT(*) as count FROM sales').get();
  return result ? result.count : 0;
}

function getRecordsByCustomer(customerId) {
  return db.prepare('SELECT * FROM sales WHERE customerId = ?').all(customerId);
}

function getRecordsByDateRange(startDate, endDate) {
  return db.prepare('SELECT * FROM sales WHERE date BETWEEN ? AND ?').all(startDate, endDate);
}

function getRecordsByCategory(category) {
  return db.prepare('SELECT * FROM sales WHERE productCategory = ?').all(category);
}

function searchRecords(filters) {
  let query = 'SELECT * FROM sales WHERE 1=1';
  const params = [];

  if (filters.customerId) {
    query += ' AND customerId = ?';
    params.push(filters.customerId);
  }
  if (filters.productCategory) {
    query += ' AND productCategory = ?';
    params.push(filters.productCategory);
  }
  if (filters.customerRegion) {
    query += ' AND customerRegion = ?';
    params.push(filters.customerRegion);
  }
  if (filters.startDate) {
    query += ' AND date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    query += ' AND date <= ?';
    params.push(filters.endDate);
  }
  if (filters.minAmount) {
    query += ' AND finalAmount >= ?';
    params.push(filters.minAmount);
  }
  if (filters.maxAmount) {
    query += ' AND finalAmount <= ?';
    params.push(filters.maxAmount);
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(filters.limit || 1000);
  params.push(filters.offset || 0);

  return db.prepare(query).all(...params);
}

// Aggregation queries
function getSalesByCategory() {
  return db.prepare(`
    SELECT 
      productCategory,
      COUNT(*) as count,
      SUM(finalAmount) as totalSales,
      AVG(finalAmount) as avgSales
    FROM sales
    GROUP BY productCategory
    ORDER BY totalSales DESC
  `).all();
}

function getSalesByRegion() {
  return db.prepare(`
    SELECT 
      customerRegion,
      COUNT(*) as count,
      SUM(finalAmount) as totalSales,
      AVG(finalAmount) as avgSales
    FROM sales
    GROUP BY customerRegion
    ORDER BY totalSales DESC
  `).all();
}

function getTopProducts(limit = 10) {
  return db.prepare(`
    SELECT 
      productName,
      brand,
      COUNT(*) as soldCount,
      SUM(quantity) as totalQuantity,
      SUM(finalAmount) as totalRevenue
    FROM sales
    GROUP BY productName, brand
    ORDER BY totalRevenue DESC
    LIMIT ?
  `).all(limit);
}

function clearDatabase() {
  db.exec('DELETE FROM sales');
  db.exec('VACUUM');
}

function closeDatabase() {
  db.close();
}

export {
  db,
  initializeDatabase,
  insertRecord,
  insertRecords,
  getAllRecords,
  getRecordCount,
  getRecordsByCustomer,
  getRecordsByDateRange,
  getRecordsByCategory,
  searchRecords,
  getSalesByCategory,
  getSalesByRegion,
  getTopProducts,
  clearDatabase,
  closeDatabase
};