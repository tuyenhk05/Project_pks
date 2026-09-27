/**
 * Send standard success response
 */
const sendSuccess = (res, statusCode = 200, message = 'Thành công', data = null, pagination = null) => {
  const responseObj = {
    success: true,
    message,
  };

  if (data !== null) {
    responseObj.data = data;
  }

  if (pagination !== null) {
    responseObj.pagination = pagination;
  }

  return res.status(statusCode).json(responseObj);
};

/**
 * Send standard error response
 */
const sendError = (res, statusCode = 400, message = 'Có lỗi xảy ra', errors = null) => {
  const responseObj = {
    success: false,
    message,
  };

  if (errors !== null) {
    responseObj.errors = errors;
  }

  return res.status(statusCode).json(responseObj);
};

module.exports = {
  sendSuccess,
  sendError,
};
