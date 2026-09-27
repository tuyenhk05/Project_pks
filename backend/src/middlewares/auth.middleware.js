const User = require('../models/users.model');
const { verifyToken } = require('../utils/jwt.util');
const { sendError } = require('../helpers/response.helper');
const { ROLES } = require('../configs/constants');

/**
 * Security Hardening & RBAC Middleware
 * - Authenticate JWT Bearer token
 * - Role-Based Access Control (Admin/Staff/Student)
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 401, 'Vui lòng đăng nhập để truy cập tài nguyên này');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, 'Tài khoản không tồn tại hoặc đã bị xóa');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Tài khoản của bạn đã bị khóa');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
    }
    next(error);
  }
};

/**
 * Require Admin or Staff role middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Vui lòng đăng nhập');
  }

  if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.STAFF) {
    return sendError(res, 403, 'Bạn không có quyền thực hiện thao tác này (Yêu cầu quyền Admin/Staff)');
  }

  next();
};

/**
 * Require Student role middleware
 */
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Vui lòng đăng nhập');
  }

  if (req.user.role !== ROLES.STUDENT) {
    return sendError(res, 403, 'Tính năng này chỉ dành cho Học viên (Student)');
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireStudent,
};
