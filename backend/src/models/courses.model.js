const mongoose = require('mongoose');
const { COURSE_STATUS } = require('../configs/constants');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên khóa học là bắt buộc'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Danh mục khóa học là bắt buộc'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Tên giảng viên là bắt buộc'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    tuitionFee: {
      type: Number,
      required: [true, 'Học phí là bắt buộc'],
      min: [0, 'Học phí không thể nhỏ hơn 0'],
    },
    capacity: {
      type: Number,
      required: [true, 'Sức chứa (số lượng học viên tối đa) là bắt buộc'],
      min: [1, 'Sức chứa tối thiểu phải là 1'],
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng học viên đã ghi danh không thể nhỏ hơn 0'],
    },
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Available slots remaining
courseSchema.virtual('availableSlots').get(function () {
  return Math.max(0, this.capacity - this.enrolledCount);
});

// Virtual: Is course full
courseSchema.virtual('isFull').get(function () {
  return this.enrolledCount >= this.capacity;
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
