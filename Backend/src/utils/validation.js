import { ApiError } from './errorHandler.js';

function validateQueryParams(req, res, next) {
  const { page, pageSize, sortBy, sortOrder, ageMin, ageMax, dateFrom, dateTo } = req.query;

  // Validate page
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return next(new ApiError(400, 'Page must be a positive integer'));
  }

  // Validate pageSize
  if (pageSize && (isNaN(pageSize) || parseInt(pageSize) < 1 || parseInt(pageSize) > 100)) {
    return next(new ApiError(400, 'Page size must be between 1 and 100'));
  }

  // Validate sortBy
  const validSortFields = ['date', 'quantity', 'customerName'];
  if (sortBy && !validSortFields.includes(sortBy)) {
    return next(new ApiError(400, `Sort by must be one of: ${validSortFields.join(', ')}`));
  }

  // Validate sortOrder
  const validSortOrders = ['asc', 'desc'];
  if (sortOrder && !validSortOrders.includes(sortOrder)) {
    return next(new ApiError(400, 'Sort order must be either "asc" or "desc"'));
  }

  // Validate age range
  if (ageMin && isNaN(ageMin)) {
    return next(new ApiError(400, 'Age minimum must be a number'));
  }
  if (ageMax && isNaN(ageMax)) {
    return next(new ApiError(400, 'Age maximum must be a number'));
  }
  if (ageMin && ageMax && parseInt(ageMin) > parseInt(ageMax)) {
    return next(new ApiError(400, 'Age minimum cannot be greater than age maximum'));
  }

  // Validate date range
  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    return next(new ApiError(400, 'Invalid date format for dateFrom'));
  }
  if (dateTo && isNaN(Date.parse(dateTo))) {
    return next(new ApiError(400, 'Invalid date format for dateTo'));
  }
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    return next(new ApiError(400, 'Date from cannot be after date to'));
  }

  next();
}

export { validateQueryParams };