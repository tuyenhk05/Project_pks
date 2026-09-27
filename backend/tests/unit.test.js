const test = require('node:test');
const assert = require('node:assert/strict');

const { escapeRegex } = require('../src/utils/regex.util');
const { getPagination } = require('../src/helpers/pagination.helper');
const { signToken, verifyToken } = require('../src/utils/jwt.util');
const { createCourseSchema } = require('../src/validations/course.validation');

test('1. escapeRegex Utility - Should safely escape special regex characters', () => {
  const unsafeInput = 'React (v18.0) + Node.js? [Masterclass]';
  const escaped = escapeRegex(unsafeInput);
  assert.equal(escaped, 'React \\(v18\\.0\\) \\+ Node\\.js\\? \\[Masterclass\\]');

  const regExp = new RegExp(escaped, 'i');
  assert.equal(regExp.test(unsafeInput), true);
});

test('2. getPagination Helper - Should correctly calculate skip, limit, and totalPages', () => {
  const result = getPagination(2, 10, 47);
  assert.equal(result.pagination.currentPage, 2);
  assert.equal(result.pagination.totalPages, 5);
  assert.equal(result.pagination.totalItems, 47);
  assert.equal(result.skip, 10);
  assert.equal(result.limit, 10);
});

test('3. JWT Util - Should sign and verify JWT tokens correctly', () => {
  const payload = { id: 'user123', email: 'student@pks.edu.vn', role: 'student' };
  const token = signToken(payload);
  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);

  const decoded = verifyToken(token);
  assert.equal(decoded.id, payload.id);
  assert.equal(decoded.email, payload.email);
  assert.equal(decoded.role, payload.role);
});

test('4. Course Validation - Should validate required course fields correctly', () => {
  const validData = {
    title: 'Khóa học React.js',
    category: 'Frontend',
    instructor: 'Giảng viên A',
    tuitionFee: 1500000,
    capacity: 30,
  };

  const { error, value } = createCourseSchema.validate(validData);
  assert.equal(error, undefined);
  assert.equal(value.title, validData.title);
  assert.equal(value.status, 'active');

  const invalidData = {
    title: 'Khóa học thiếu tiền',
    capacity: -5,
  };
  const { error: errInvalid } = createCourseSchema.validate(invalidData);
  assert.ok(errInvalid !== undefined);
});
