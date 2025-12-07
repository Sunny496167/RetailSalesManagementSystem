# Retail Sales Management - Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Layout components
│   │   ├── Sales/          # Sales-specific components
│   │   ├── Filters/        # Filter components
│   │   └── Common/         # Common components (Button, Input, etc.)
│   ├── pages/              # Page components
│   │   ├── DashboardPage.jsx
│   │   ├── ErrorPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/              # Redux store
│   │   ├── store.js        # Store configuration
│   │   └── slices/         # Redux slices
│   │       ├── salesSlice.js
│   │       ├── filtersSlice.js
│   │       └── uiSlice.js
│   ├── services/           # API services
│   │   └── api.js          # Axios configuration & API calls
│   ├── hooks/              # Custom React hooks
│   │   ├── useSalesData.js
│   │   ├── useFilters.js
│   │   ├── useFilterOptions.js
│   │   ├── useStatistics.js
│   │   └── useDebounce.js
│   ├── utils/              # Utility functions
│   │   ├── formatters.js   # Currency, date formatting
│   │   ├── validators.js   # Input validation
│   │   ├── helpers.js      # General helpers
│   │   └── constants.js    # App constants
│   ├── routes/             # React Router configuration
│   │   └── index.jsx
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── main.jsx            # App entry point
│   └── App.jsx             # Root component
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── .env                   # Environment variables (create this)
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Technology Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📦 Redux State Management

### Store Structure
```javascript
{
  sales: {
    data: [],              // Sales records
    pagination: {},        // Pagination info
    filterOptions: {},     // Available filter options
    statistics: {},        // Sales statistics
    loading: false,
    error: null
  },
  filters: {
    search: '',
    customerRegion: [],
    gender: [],
    ageMin: null,
    ageMax: null,
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: null,
    dateTo: null,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  },
  ui: {
    isSidebarOpen: true,
    isFilterPanelOpen: false,
    viewMode: 'table',
    theme: 'light',
    notifications: []
  }
}
```

## 🎣 Custom Hooks Usage

### useSalesData
```javascript
const { sales, pagination, loading, error, refetch } = useSalesData();
```

### useFilters
```javascript
const { 
  filters, 
  setSearch, 
  setCustomerRegion, 
  setPage, 
  resetFilters 
} = useFilters();
```

### useFilterOptions
```javascript
const { filterOptions, loading } = useFilterOptions();
```

### useDebounce
```javascript
const debouncedSearch = useDebounce(searchTerm, 500);
```

## 🛣️ Routing

- `/` - Dashboard (main page)
- `/dashboard` - Dashboard (alias)
- `*` - 404 Not Found

## 🎨 Styling

Using Tailwind CSS with custom configurations:
- Custom color palette
- Responsive breakpoints
- Custom utility classes
- CSS variables for theming

## 🔌 API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import { salesApi } from '@/services/api';

// Get sales data
const response = await salesApi.getSales(params);

// Get filter options
const options = await salesApi.getFilterOptions();

// Get statistics
const stats = await salesApi.getStatistics();
```

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Retail Sales Management
VITE_APP_VERSION=1.0.0
```

## 🚦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔍 Features Implementation

### ✅ Search
- Full-text search across customer name and phone
- Debounced input for performance
- Maintains filter and sort state

### ✅ Filters
- Multi-select filters for categorical data
- Range filters for age and date
- Filters work in combination
- Reset functionality

### ✅ Sorting
- Sort by date, quantity, customer name
- Ascending/descending order
- Maintains search and filter state

### ✅ Pagination
- 10 items per page (configurable)
- Previous/Next navigation
- Current page indicator
- Total records count

## 🎯 Next Steps

1. **Create Components** - Build UI components in the `components/` directory
2. **Create Pages** - Implement page components in `pages/`
3. **Style Components** - Apply Tailwind CSS classes
4. **Test Integration** - Connect frontend to backend API
5. **Add Error Handling** - Implement error boundaries and user feedback

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🐛 Troubleshooting

### CORS Issues
Make sure backend has CORS enabled for `http://localhost:3000`

### API Connection Failed
- Check backend is running on port 5000
- Verify `.env` has correct API URL
- Check network tab in browser DevTools

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```