const Course = require('../../models/courses.model');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { getPagination } = require('../../helpers/pagination.helper');
const { escapeRegex } = require('../../utils/regex.util');
const { COURSE_STATUS } = require('../../configs/constants');

/**
 * Get all courses for Admin (including active, inactive, hidden)
 */
const getCourses = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const safeSearch = escapeRegex(search.trim());
      query.title = { $regex: safeSearch, $options: 'i' };
    }

    if (category && category.trim() !== '') {
      query.category = category.trim();
    }

    if (status && status.trim() !== '') {
      query.status = status.trim();
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
 * Get course detail for Admin
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    return sendSuccess(res, 200, 'Lấy chi tiết khóa học thành công', course);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new course
 */
const createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    const course = await Course.create(courseData);

    return sendSuccess(res, 201, 'Tạo khóa học mới thành công', course);
  } catch (error) {
    next(error);
  }
};

/**
 * Update course
 */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    // Validate that new capacity is not lower than current enrolledCount
    if (updateData.capacity !== undefined && updateData.capacity < course.enrolledCount) {
      return sendError(
        res,
        400,
        `Sức chứa mới (${updateData.capacity}) không thể nhỏ hơn số lượng học viên đã ghi danh hiện tại (${course.enrolledCount})`
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, 200, 'Cập nhật khóa học thành công', updatedCourse);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete course (set status to hidden)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return sendError(res, 404, 'Không tìm thấy khóa học');
    }

    course.status = COURSE_STATUS.HIDDEN;
    await course.save();

    return sendSuccess(res, 200, 'Ẩn khóa học thành công', course);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
