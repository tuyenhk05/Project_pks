const Enrollment = require('../../models/enrollments.model');
const Course = require('../../models/courses.model');
const { sendSuccess, sendError } = require('../../helpers/response.helper');
const { COURSE_STATUS, ENROLLMENT_STATUS } = require('../../configs/constants');

/**
 * Enroll student into a course
 * Handles race conditions using Atomic Update (findOneAndUpdate)
 * Prevents IDOR by strictly binding userId to req.user.id
 */
const enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return sendError(res, 400, 'Vui lòng cung cấp courseId');
    }

    // 1. Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return sendError(res, 404, 'Khóa học không tồn tại');
    }

    if (courseExists.status !== COURSE_STATUS.ACTIVE) {
      return sendError(res, 400, 'Khóa học hiện không mở đăng ký');
    }

    // 2. Check if student already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    if (existingEnrollment) {
      return sendError(res, 400, 'Bạn đã đăng ký khóa học này rồi');
    }

    // 3. ATOMIC UPDATE: Increment enrolledCount only if enrolledCount < capacity
    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        status: COURSE_STATUS.ACTIVE,
        $expr: { $lt: ['$enrolledCount', '$capacity'] },
      },
      { $inc: { enrolledCount: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return sendError(res, 400, 'Khóa học đã đủ số lượng (hết chỗ) hoặc không mở đăng ký');
    }

    // 4. Create enrollment record
    try {
      const enrollment = await Enrollment.create({
        userId,
        courseId,
        status: ENROLLMENT_STATUS.ENROLLED,
        enrolledAt: new Date(),
      });

      const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('courseId');

      return sendSuccess(res, 201, 'Ghi danh khóa học thành công', populatedEnrollment);
    } catch (err) {
      // Rollback course enrolledCount if enrollment creation failed (e.g. duplicate compound index race condition)
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: -1 } });

      if (err.code === 11000) {
        return sendError(res, 400, 'Bạn đã đăng ký khóa học này rồi');
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get enrolled courses of the logged-in student
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Lấy danh sách khóa học của tôi thành công', enrollments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enroll,
  getMyEnrollments,
};
