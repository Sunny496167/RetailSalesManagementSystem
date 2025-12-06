import { ApiError } from './errorHandler.js';

function validateQueryParams(req, res, next) {
  const { page, pageSize, sortBy, sortOrder, ageMin, ageMax, dateFrom, dateTo } = req.query;

  // Validate page
  if (page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new ApiError(400, 'Page must be a positive integer'));
    }
  }

  // Validate pageSize
  if (pageSize) {
    const sizeNum = parseInt(pageSize);
    if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 100) {
      return next(new ApiError(400, 'Page size must be between 1 and 100'));
    }
  }

  // Validate sortBy
  const validSortFields = ['date', 'quantity', 'customerName', 'finalAmount', 'age'];
  if (sortBy && !validSortFields.includes(sortBy)) {
    return next(new ApiError(400, `Sort by must be one of: ${validSortFields.join(', ')}`));
  }

  // Validate sortOrder
  const validSortOrders = ['asc', 'desc'];
  if (sortOrder && !validSortOrders.includes(sortOrder.toLowerCase())) {
    return next(new ApiError(400, 'Sort order must be either "asc" or "desc"'));
  }

  // Validate age range
  if (ageMin) {
    const minAge = parseInt(ageMin);
    if (isNaN(minAge) || minAge < 0) {
      return next(new ApiError(400, 'Age minimum must be a non-negative number'));
    }
  }
  
  if (ageMax) {
    const maxAge = parseInt(ageMax);
    if (isNaN(maxAge) || maxAge < 0) {
      return next(new ApiError(400, 'Age maximum must be a non-negative number'));
    }
  }
  
  if (ageMin && ageMax) {
    const minAge = parseInt(ageMin);
    const maxAge = parseInt(ageMax);
    if (minAge > maxAge) {
      return next(new ApiError(400, 'Age minimum cannot be greater than age maximum'));
    }
  }

  // Validate date range
  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    return next(new ApiError(400, 'Invalid date format for dateFrom. Use YYYY-MM-DD format'));
  }
  
  if (dateTo && isNaN(Date.parse(dateTo))) {
    return next(new ApiError(400, 'Invalid date format for dateTo. Use YYYY-MM-DD format'));
  }
  
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    return next(new ApiError(400, 'Date from cannot be after date to'));
  }

  next();
}

export { validateQueryParams };