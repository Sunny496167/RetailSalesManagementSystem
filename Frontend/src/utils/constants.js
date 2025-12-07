export const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Date (Newest First)', sortBy: 'date', sortOrder: 'desc' },
    { value: 'date-asc', label: 'Date (Oldest First)', sortBy: 'date', sortOrder: 'asc' },
    { value: 'quantity-desc', label: 'Quantity (High to Low)', sortBy: 'quantity', sortOrder: 'desc' },
    { value: 'quantity-asc', label: 'Quantity (Low to High)', sortBy: 'quantity', sortOrder: 'asc' },
    { value: 'name-asc', label: 'Customer Name (A-Z)', sortBy: 'customerName', sortOrder: 'asc' },
    { value: 'name-desc', label: 'Customer Name (Z-A)', sortBy: 'customerName', sortOrder: 'desc' },
  ];
  
  export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
  
  export const VIEW_MODES = {
    TABLE: 'table',
    GRID: 'grid',
  };
  
  export const API_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  };