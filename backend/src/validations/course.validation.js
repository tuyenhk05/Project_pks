const Joi = require('joi');
const { COURSE_STATUS } = require('../configs/constants');

const createCourseSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Tên khóa học không được để trống',
    'any.required': 'Tên khóa học là bắt buộc',
  }),
  category: Joi.string().trim().required().messages({
    'string.empty': 'Danh mục không được để trống',
    'any.required': 'Danh mục là bắt buộc',
  }),
  instructor: Joi.string().trim().required().messages({
    'string.empty': 'Tên giảng viên không được để trống',
    'any.required': 'Tên giảng viên là bắt buộc',
  }),
  description: Joi.string().trim().allow('').default(''),
  tuitionFee: Joi.number().min(0).required().messages({
    'number.base': 'Học phí phải là một số',
    'number.min': 'Học phí không được nhỏ hơn 0',
    'any.required': 'Học phí là bắt buộc',
  }),
  capacity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Sức chứa phải là số nguyên',
    'number.min': 'Sức chứa tối thiểu là 1',
    'any.required': 'Sức chứa là bắt buộc',
  }),
  status: Joi.string().valid(...Object.values(COURSE_STATUS)).default(COURSE_STATUS.ACTIVE).messages({
    'any.only': 'Trạng thái khóa học không hợp lệ',
  }),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().trim(),
  category: Joi.string().trim(),
  instructor: Joi.string().trim(),
  description: Joi.string().trim().allow(''),
  tuitionFee: Joi.number().min(0),
  capacity: Joi.number().integer().min(1),
  status: Joi.string().valid(...Object.values(COURSE_STATUS)),
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật',
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};
