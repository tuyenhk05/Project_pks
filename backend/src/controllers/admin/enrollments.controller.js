const Enrollment = require('../../models/enrollments.model');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { getPagination } = require('../../helpers/pagination.helper');

/**
 * Get all enrollments for Admin
 */
const getEnrollments = async (req, res, next) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (courseId) {
      query.courseId = courseId;
    }

    const totalItems = await Enrollment.countDocuments(query);
    const { pagination, skip, limit: limitNum } = getPagination(page, limit, totalItems);

    const enrollments = await Enrollment.find(query)
      .populate('userId', 'fullName email role')
      .populate('courseId', 'title category tuitionFee capacity enrolledCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, 200, 'Lấy danh sách ghi danh thành công', enrollments, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of enrolled students for a specific course
 */
const getEnrollmentsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'fullName email role isActive')
      .populate('courseId', 'title capacity enrolledCount')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Lấy danh sách học viên theo khóa học thành công', enrollments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnrollments,
  getEnrollmentsByCourse,
};
