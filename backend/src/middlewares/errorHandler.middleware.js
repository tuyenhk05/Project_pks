const { sendError } = require('../helpers/response.helper');

/**
 * Global Express Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi hệ thống nội bộ';

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('; ');
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Dữ liệu ID không hợp lệ: ${err.value}`;
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Giá trị ${field} đã tồn tại trong hệ thống` : 'Dữ liệu đã tồn tại trong hệ thống';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
