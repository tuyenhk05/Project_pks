const mongoose = require('mongoose');
const { ENROLLMENT_STATUS } = require('../configs/constants');

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID là bắt buộc']
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID là bắt buộc']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ENROLLMENT_STATUS),
        message: 'Trạng thái {VALUE} không hợp lệ'
      },
      default: ENROLLMENT_STATUS.ENROLLED
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound Unique Index: Ngăn chặn ghi danh trùng lặp ở tầng Database (Rule 06 & Skill Race Condition)
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
