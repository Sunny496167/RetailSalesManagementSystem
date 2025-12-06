# Retail Sales Management System - Backend API

## 🎯 Overview
A high-performance backend API for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built with Node.js, Express, and SQLite for optimal performance with large datasets.

## ✨ Key Features

### Core Functionality
- ✅ **Full-Text Search** - Case-insensitive search across customer name and phone number
- ✅ **Multi-Select Filters** - Customer Region, Gender, Product Category, Tags, Payment Method
- ✅ **Range Filters** - Age range and Date range filtering
- ✅ **Dynamic Sorting** - Sort by Date, Quantity, Customer Name, Final Amount
- ✅ **Smart Pagination** - Configurable page size with efficient data loading
- ✅ **Filter Options API** - Dynamic dropdown options for UI
- ✅ **Statistics Dashboard** - Real-time sales analytics

### Technical Features
- 🚀 **SQLite Database** - Fast, file-based database with WAL mode
- 📊 **Indexed Queries** - Optimized database indexes for performance
- 🔄 **Batch Processing** - Efficient bulk data insertion
- 🛡️ **Error Handling** - Comprehensive error management
- ✅ **Input Validation** - Request validation middleware
- 📝 **Clean Architecture** - Modular, maintainable code structure

## 🏗️ Tech Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** SQLite3 (better-sqlite3)
- **CSV Parser:** csv-parser
- **Module System:** ES Modules

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── salesController.js      # HTTP request handlers
│   ├── services/
│   │   └── salesService.js         # Business logic layer
│   ├── routes/
│   │   └── salesRoutes.js          # API route definitions
│   ├── utils/
│   │   ├── database.js             # SQLite database operations
│   │   ├── dataLoader.js           # CSV data loading
│   │   ├── validation.js           # Input validation
│   │   └── errorHandler.js         # Error handling
│   └── index.js                    # Application entry point
├── scripts/
│   └── reloadData.js               # Data reload utility
├── data/
│   ├── truestate_assignment_dataset.csv  # CSV dataset
│   └── sales.db                    # SQLite database (auto-generated)
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Prepare Dataset**
```bash
# Create data directory
mkdir -p data

# Place your CSV file in the data directory as:
# backend/data/truestate_assignment_dataset.csv
```

3. **Start Server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will automatically:
- Initialize the SQLite database
- Create necessary indexes
- Load data from CSV (only on first run)
- Start listening on port 5000

### Reload Data
```bash
# Force reload data from CSV (clears existing data)
npm run reload-data
```

## 📡 API Endpoints

### 1. Get Sales Data
Retrieve sales records with filtering, searching, sorting, and pagination.

**Endpoint:** `GET /api/sales`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number (1-indexed) |
| `pageSize` | Integer | 10 | Records per page (1-100) |
| `search` | String | - | Search term for customer name/phone |
| `sortBy` | String | date | Field to sort by (date, quantity, customerName, finalAmount, age) |
| `sortOrder` | String | desc | Sort order (asc, desc) |
| `customerRegion` | String | - | Comma-separated regions |
| `gender` | String | - | Comma-separated genders |
| `ageMin` | Integer | - | Minimum age |
| `ageMax` | Integer | - | Maximum age |
| `productCategory` | String | - | Comma-separated categories |
| `tags` | String | - | Comma-separated tags |
| `paymentMethod` | String | - | Comma-separated payment methods |
| `dateFrom` | Date | - | Start date (YYYY-MM-DD) |
| `dateTo` | Date | - | End date (YYYY-MM-DD) |

**Example Request:**
```bash
GET /api/sales?page=1&pageSize=20&search=john&customerRegion=North,South&gender=Male&ageMin=25&ageMax=45&sortBy=date&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customerId": "C001",
      "customerName": "John Doe",
      "phoneNumber": "1234567890",
      "gender": "Male",
      "age": 35,
      "customerRegion": "North",
      "productCategory": "Electronics",
      "quantity": 2,
      "finalAmount": 1500.00,
      "date": "2024-01-15",
      "paymentMethod": "Credit Card"
      // ... more fields
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalRecords": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "filters": {
    "customerRegion": ["North", "South"],
    "gender": ["Male"],
    "ageMin": 25,
    "ageMax": 45
  },
  "search": "john",
  "sort": {
    "sortBy": "date",
    "sortOrder": "desc"
  }
}
```

### 2. Get Filter Options
Retrieve all available filter options for UI dropdowns.

**Endpoint:** `GET /api/sales/filter-options`

**Response:**
```json
{
  "customerRegions": ["North", "South", "East", "West"],
  "genders": ["Male", "Female", "Other"],
  "productCategories": ["Electronics", "Clothing", "Home & Garden"],
  "tags": ["premium", "discount", "new arrival", "best seller"],
  "paymentMethods": ["Credit Card", "Debit Card", "Cash", "UPI"],
  "ageRange": {
    "min": 18,
    "max": 80
  },
  "dateRange": {
    "min": "2024-01-01",
    "max": "2024-12-31"
  }
}
```

### 3. Get Statistics
Retrieve aggregate statistics about sales data.

**Endpoint:** `GET /api/sales/stats`

**Response:**
```json
{
  "totalTransactions": 50000,
  "totalRevenue": 12500000.50,
  "averageOrderValue": 250.00,
  "totalQuantitySold": 125000,
  "uniqueCustomers": 12000,
  "uniqueProducts": 5000
}
```

### 4. Health Check
Check server and database status.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": {
    "connected": true,
    "recordCount": 50000
  },
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

## 🎯 Architecture

### Layered Architecture
```
┌─────────────────┐
│   HTTP Request  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Routes  │  → Define API endpoints
    └────┬─────┘
         │
  ┌──────▼──────────┐
  │  Validation     │  → Validate input
  └──────┬──────────┘
         │
  ┌──────▼──────────┐
  │  Controllers    │  → Handle HTTP layer
  └──────┬──────────┘
         │
  ┌──────▼──────────┐
  │  Services       │  → Business logic
  └──────┬──────────┘
         │
  ┌──────▼──────────┐
  │  Database Utils │  → Data access layer
  └──────┬──────────┘
         │
    ┌────▼────┐
    │ SQLite  │
    └─────────┘
```

### Key Design Principles

1. **Single Responsibility**: Each module has one clear purpose
2. **Separation of Concerns**: HTTP, business logic, and data access are isolated
3. **Database Optimization**: 
   - Indexed columns for fast queries
   - WAL mode for concurrent reads
   - Batch inserts for data loading
4. **Query Efficiency**: All filtering, sorting, and pagination done at database level
5. **Error Handling**: Comprehensive error catching and logging
6. **Graceful Shutdown**: Clean database closure on process termination

## 🔍 Search & Filter Logic

### Search Implementation
- **Fields**: Customer Name, Phone Number
- **Type**: Partial match, case-insensitive
- **SQL**: Uses `LIKE` with wildcards
- **Index**: Composite index on search fields

### Filter Logic
- **Multi-Select**: Uses `IN` clause for multiple values
- **Range**: Uses `>=` and `<=` for min/max
- **Tags**: Uses `LIKE` with OR logic (any tag matches)
- **Combination**: All filters use AND logic (must match all)

### Sort Implementation
- **Customer Name**: Case-insensitive using `COLLATE NOCASE`
- **Date/Numeric**: Direct comparison
- **Default**: Date DESC (newest first)

### Pagination
- Uses SQL `LIMIT` and `OFFSET`
- Calculates total pages based on filtered count
- Returns navigation metadata

## 🛡️ Error Handling

### Error Types
- **400 Bad Request**: Invalid input parameters
- **404 Not Found**: Route not found
- **500 Internal Server Error**: Database or system errors

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

## 🧪 Testing

### Manual Testing with cURL

**Basic Query:**
```bash
curl "http://localhost:5000/api/sales?page=1&pageSize=10"
```

**Search:**
```bash
curl "http://localhost:5000/api/sales?search=john"
```

**Multiple Filters:**
```bash
curl "http://localhost:5000/api/sales?customerRegion=North,South&gender=Male,Female&ageMin=25&ageMax=50&productCategory=Electronics"
```

**With Sorting:**
```bash
curl "http://localhost:5000/api/sales?sortBy=finalAmount&sortOrder=desc&pageSize=20"
```

**Complex Query:**
```bash
curl "http://localhost:5000/api/sales?search=john&customerRegion=North&gender=Male&ageMin=30&ageMax=40&dateFrom=2024-01-01&dateTo=2024-12-31&sortBy=date&sortOrder=desc&page=1&pageSize=25"
```

## 🎯 Performance Considerations

### Database Optimizations
- **Indexes**: Created on all filterable columns
- **WAL Mode**: Better concurrent read performance
- **Batch Inserts**: 1000 records per transaction
- **Query Optimization**: Filter at database level, not in memory

### Expected Performance
- **Search**: < 50ms for most queries
- **Filter**: < 100ms with multiple filters
- **Sort**: < 50ms on indexed columns
- **Load 50k records**: ~10-15 seconds

### Scalability
- Handles datasets up to 1M records efficiently
- For larger datasets, consider PostgreSQL or partitioning

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
PORT=5000
NODE_ENV=development
```

### Database Configuration
Located in `src/utils/database.js`:
```javascript
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB
```

## 🚨 Edge Cases Handled

✅ **No Results**: Returns empty array with proper pagination  
✅ **Invalid Parameters**: Validation catches and returns 400  
✅ **Missing Fields**: Handles NULL values gracefully  
✅ **Large Filters**: Efficiently processes multiple filter combinations  
✅ **Date Parsing**: Validates and handles invalid date formats  
✅ **Age Range**: Prevents invalid ranges (min > max)  
✅ **Empty Database**: Gracefully handles zero records  
✅ **Concurrent Requests**: WAL mode handles multiple reads  

## 📊 Database Schema

```sql
CREATE TABLE sales (
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
);
```

## 🔄 Data Flow

```
CSV File
   │
   ├─→ csv-parser (streaming)
   │
   ├─→ Field normalization
   │
   ├─→ Batch collection (1000 records)
   │
   ├─→ SQLite insertion (transaction)
   │
   └─→ Database (indexed storage)

Query Request
   │
   ├─→ Validation middleware
   │
   ├─→ Controller (parse params)
   │
   ├─→ Service (business logic)
   │
   ├─→ Database (SQL query)
   │
   └─→ JSON response
```

## 🐛 Common Issues & Solutions

### Issue: "Database not initialized"
**Solution**: Ensure CSV file is in `backend/data/` directory

### Issue: "CSV file not found"
**Solution**: Check file path and naming:
- `truestate_assignment_dataset.csv`
- `sales_data.csv`
- `dataset.csv`

### Issue: Slow queries
**Solution**: Check indexes are created (see logs on startup)

### Issue: Out of memory
**Solution**: Increase Node.js heap size:
```bash
node --max-old-space-size=4096 src/index.js
```

## 🚀 Future Enhancements

- [ ] Add authentication/authorization (JWT)
- [ ] Implement rate limiting
- [ ] Add caching layer (Redis)
- [ ] Export functionality (CSV, PDF)
- [ ] Advanced analytics endpoints
- [ ] WebSocket for real-time updates
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Comprehensive test suite (Jest)
- [ ] Docker containerization
- [ ] Migration to PostgreSQL for production

## 📝 License

ISC

## 👥 Support

For issues or questions, please check:
1. This README
2. Error logs in console
3. Database connection via `/health` endpoint

---

**Built for TruEstate SDE Intern Assignment**  
*Demonstrating production-grade backend engineering*