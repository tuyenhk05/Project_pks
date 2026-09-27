const User = require('../../models/users.model');
const { signToken } = require('../../utils/jwt.util');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { ROLES } = require('../../configs/constants');

/**
 * Register a new Student account
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 400, 'Email này đã được đăng ký trong hệ thống');
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: ROLES.STUDENT,
    });

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return sendSuccess(res, 201, 'Đăng ký tài khoản thành công', {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Student Login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Email hoặc mật khẩu không chính xác');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Tài khoản của bạn đã bị vô hiệu hóa');
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return sendSuccess(res, 200, 'Đăng nhập thành công', {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user profile
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Lấy thông tin cá nhân thành công', req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout student
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return sendSuccess(res, 200, 'Đăng xuất thành công');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
