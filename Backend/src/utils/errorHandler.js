class ApiError extends Error {
    constructor(statusCode, message) 
    {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  function errorHandler(err, req, res, next) {
    let { statusCode, message } = err;
  
    if (!err.isOperational) {
      statusCode = 500;
      message = 'Internal server error';
    }
  
    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  
    if (!err.isOperational) {
      console.error('ERROR:', err);
    }
  }
  
export { ApiError, errorHandler };