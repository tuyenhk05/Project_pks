const mongoose = require('mongoose');
const { COURSE_STATUS } = require('../configs/constants');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên khóa học là bắt buộc'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Danh mục khóa học là bắt buộc'],
      trim: true
    },
    instructor: {
      type: String,
      required: [true, 'Tên giảng viên là bắt buộc'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    tuitionFee: {
      type: Number,
      required: [true, 'Học phí là bắt buộc'],
      min: [0, 'Học phí không thể âm']
    },
    capacity: {
      type: Number,
      required: [true, 'Sức chứa khóa học là bắt buộc'],
      min: [1, 'Sức chứa tối thiểu phải là 1']
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng học viên đã ghi danh không thể âm']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(COURSE_STATUS),
        message: 'Trạng thái {VALUE} không hợp lệ'
      },
      default: COURSE_STATUS.ACTIVE
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

// Virtual: Số chỗ còn lại
courseSchema.virtual('availableSlots').get(function () {
  return Math.max(0, this.capacity - this.enrolledCount);
});

// Virtual: Kiểm tra đã đầy chỗ chưa
courseSchema.virtual('isFull').get(function () {
  return this.enrolledCount >= this.capacity;
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
