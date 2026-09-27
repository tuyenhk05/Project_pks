const User = require('../../models/users.model');
const { signToken } = require('../../utils/jwt.util');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { ROLES } = require('../../configs/constants');

/**
 * Admin / Staff Login
 */
const adminLogin = async (req, res, next) => {
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

    if (user.role !== ROLES.ADMIN && user.role !== ROLES.STAFF) {
      return sendError(res, 403, 'Tài khoản không có quyền truy cập trang Admin');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Tài khoản đã bị vô hiệu hóa');
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return sendSuccess(res, 200, 'Đăng nhập Quản trị thành công', {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
};
