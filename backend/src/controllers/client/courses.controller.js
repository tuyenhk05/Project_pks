const Course = require('../../models/courses.model');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { getPagination } = require('../../helpers/pagination.helper');
const { escapeRegex } = require('../../utils/regex.util');
const { COURSE_STATUS } = require('../../configs/constants');

/**
 * Get active courses with search, filter, and pagination
 */
const getCourses = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {
      status: COURSE_STATUS.ACTIVE,
    };

    if (search && search.trim() !== '') {
      const safeSearch = escapeRegex(search.trim());
      query.title = { $regex: safeSearch, $options: 'i' };
    }

    if (category && category.trim() !== '') {
      query.category = category.trim();
    }

    const totalItems = await Course.countDocuments(query);
    const { pagination, skip, limit: limitNum } = getPagination(page, limit, totalItems);

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return sendSuccess(res, 200, 'Lấy danh sách khóa học thành công', courses, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get active course detail by ID
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      _id: id,
      status: COURSE_STATUS.ACTIVE,
    });

    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học hoặc khóa học đã bị ẩn');
    }

    return sendSuccess(res, 200, 'Lấy chi tiết khóa học thành công', course);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
};
