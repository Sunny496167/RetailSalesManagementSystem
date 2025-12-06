class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorHandler(err, req, res, next) {
  let { statusCode, message, isOperational } = err;

  // Default to 500 for non-operational errors
  if (!isOperational) {
    statusCode = 500;
    message = 'Internal server error';
  }

  // SQLite specific error handling
  if (err.code === 'SQLITE_ERROR') {
    statusCode = 500;
    message = 'Database query error';
  }

  const response = {
    success: false,
    error: message,
    statusCode
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);

  // Log non-operational errors
  if (!isOperational) {
    console.error('ERROR:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
}

export { ApiError, errorHandler };