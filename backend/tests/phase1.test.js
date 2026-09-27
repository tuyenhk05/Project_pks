const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const { ROLES, COURSE_STATUS, ENROLLMENT_STATUS, PAGINATION } = require('../src/configs/constants');
const connectDB = require('../src/configs/database');
const User = require('../src/models/users.model');
const Course = require('../src/models/courses.model');
const Enrollment = require('../src/models/enrollments.model');
const { seedUsers, seedCourses } = require('../src/configs/seed');

let mongoServer;

describe('=== KIỂM THỬ TỔNG THỂ PHASE 1 (DATABASE, MODELS & SEED) ===', () => {
  before(async () => {
    // Khởi tạo In-Memory MongoDB Server để test độc lập, an toàn
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('1. Kiểm tra Constants & Configs (Rule 01, 02)', () => {
    it('Phải định nghĩa đầy đủ các vai trò ROLES: student, admin, staff', () => {
      assert.equal(ROLES.STUDENT, 'student');
      assert.equal(ROLES.ADMIN, 'admin');
      assert.equal(ROLES.STAFF, 'staff');
    });

    it('Phải định nghĩa đầy đủ COURSE_STATUS: active, inactive, hidden', () => {
      assert.equal(COURSE_STATUS.ACTIVE, 'active');
      assert.equal(COURSE_STATUS.INACTIVE, 'inactive');
      assert.equal(COURSE_STATUS.HIDDEN, 'hidden');
    });

    it('Phải định nghĩa đầy đủ ENROLLMENT_STATUS: enrolled, cancelled, completed', () => {
      assert.equal(ENROLLMENT_STATUS.ENROLLED, 'enrolled');
      assert.equal(ENROLLMENT_STATUS.CANCELLED, 'cancelled');
      assert.equal(ENROLLMENT_STATUS.COMPLETED, 'completed');
    });

    it('Phải định nghĩa hằng số PAGINATION', () => {
      assert.equal(PAGINATION.DEFAULT_PAGE, 1);
      assert.equal(PAGINATION.DEFAULT_LIMIT, 10);
    });

    it('Database config phải export hàm connectDB hợp lệ', () => {
      assert.equal(typeof connectDB, 'function');
    });
  });

  describe('2. Kiểm tra User Model & Bảo mật Password (Rule 06, DEVELOPMENT_PLAN)', () => {
    it('Validation: Phải bắt buộc fullName, email, password', async () => {
      const user = new User({});
      let err;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err, 'Phải có validation error');
      assert.ok(err.errors.fullName, 'fullName là bắt buộc');
      assert.ok(err.errors.email, 'email là bắt buộc');
      assert.ok(err.errors.password, 'password là bắt buộc');
    });

    it('Validation: Bắt lỗi định dạng email không hợp lệ', async () => {
      const user = new User({
        fullName: 'Test User',
        email: 'invalid-email-format',
        password: 'Password@123'
      });
      let err;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err, 'Phải có lỗi email format');
      assert.ok(err.errors.email);
    });

    it('Bảo mật: Mật khẩu phải được hash bằng bcrypt (salt >= 10) trước khi lưu vào DB (Pre-save hook)', async () => {
      const plainPassword = 'StudentSecret@123';
      const user = await User.create({
        fullName: 'Học viên Test',
        email: 'student_test@pks.edu.vn',
        password: plainPassword,
        role: ROLES.STUDENT
      });

      // Mật khẩu trong DB không được là plaintext
      assert.notEqual(user.password, plainPassword);
      // Mật khẩu phải có format của bcrypt hash
      assert.match(user.password, /^\$2[aby]\$\d{2}\$/);

      // Salt rounds >= 10
      const rounds = bcrypt.getRounds(user.password);
      assert.ok(rounds >= 10, `Salt rounds (${rounds}) phải >= 10 theo tiêu chuẩn bảo mật`);
    });

    it('Bảo mật: Method comparePassword phải xác thực chính xác mật khẩu', async () => {
      const plainPassword = 'AdminSecret@123';
      const user = await User.create({
        fullName: 'Admin Test',
        email: 'admin_test@pks.edu.vn',
        password: plainPassword,
        role: ROLES.ADMIN
      });

      const foundUser = await User.findById(user._id).select('+password');
      const isCorrect = await foundUser.comparePassword(plainPassword);
      assert.equal(isCorrect, true, 'comparePassword phải trả về true khi pass khớp');

      const isWrong = await foundUser.comparePassword('WrongPassword');
      assert.equal(isWrong, false, 'comparePassword phải trả về false khi pass sai');
    });

    it('Bảo mật: toJSON phải tự động ẩn field password và __v khi trả về', async () => {
      const user = await User.findOne({ email: 'student_test@pks.edu.vn' });
      const json = user.toJSON();
      assert.equal(json.password, undefined, 'toJSON không được để lộ password');
      assert.equal(json.__v, undefined, 'toJSON không được để lộ __v');
    });

    it('Database Constraint: Email phải là unique (không cho phép trùng email)', async () => {
      let duplicateErr;
      try {
        await User.create({
          fullName: 'Trùng Email',
          email: 'student_test@pks.edu.vn',
          password: 'Password@123'
        });
      } catch (e) {
        duplicateErr = e;
      }
      assert.ok(duplicateErr, 'Phải báo lỗi khi tạo trùng email');
      assert.equal(duplicateErr.code, 11000, 'Mã lỗi phải là 11000 (duplicate key)');
    });
  });

  describe('3. Kiểm tra Course Model & Virtuals (Rule 02, DEVELOPMENT_PLAN)', () => {
    it('Validation: Phải bắt buộc title, category, instructor, tuitionFee, capacity', async () => {
      const course = new Course({});
      let err;
      try {
        await course.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err);
      assert.ok(err.errors.title);
      assert.ok(err.errors.category);
      assert.ok(err.errors.instructor);
      assert.ok(err.errors.tuitionFee);
      assert.ok(err.errors.capacity);
    });

    it('Validation: tuitionFee >= 0, capacity >= 1', async () => {
      const course = new Course({
        title: 'Khóa học không hợp lệ',
        category: 'Test',
        instructor: 'Test',
        tuitionFee: -500,
        capacity: 0
      });
      let err;
      try {
        await course.validate();
      } catch (e) {
        err = e;
      }
      assert.ok(err);
      assert.ok(err.errors.tuitionFee);
      assert.ok(err.errors.capacity);
    });

    it('Virtuals: availableSlots và isFull phải tính toán đúng trạng thái còn/hết chỗ', async () => {
      const course = await Course.create({
        title: 'Lập trình Node.js Chuyên Sâu',
        category: 'Backend',
        instructor: 'ThS. Trần Văn Nam',
        tuitionFee: 3000000,
        capacity: 20,
        enrolledCount: 19
      });

      assert.equal(course.availableSlots, 1, 'Còn 1 chỗ khi capacity 20, enrolled 19');
      assert.equal(course.isFull, false, 'isFull phải là false khi còn chỗ');

      course.enrolledCount = 20;
      assert.equal(course.availableSlots, 0, 'Còn 0 chỗ khi đầy');
      assert.equal(course.isFull, true, 'isFull phải là true khi đầy');
    });

    it('toJSON: Course phải bao gồm các virtual fields availableSlots và isFull', async () => {
      const course = await Course.findOne({ title: 'Lập trình Node.js Chuyên Sâu' });
      const json = course.toJSON();
      assert.equal(typeof json.availableSlots, 'number');
      assert.equal(typeof json.isFull, 'boolean');
      assert.equal(json.__v, undefined);
    });
  });

  describe('4. Kiểm tra Enrollment Model & Skill Race Condition Index', () => {
    it('Compound Unique Index { userId: 1, courseId: 1 } chặn trùng lặp ở tầng database', async () => {
      await Enrollment.syncIndexes();

      const user = await User.findOne({ email: 'student_test@pks.edu.vn' });
      const course = await Course.findOne({ title: 'Lập trình Node.js Chuyên Sâu' });

      // Lần 1: Ghi danh thành công
      const enrollment1 = await Enrollment.create({
        userId: user._id,
        courseId: course._id
      });
      assert.ok(enrollment1._id);
      assert.equal(enrollment1.status, ENROLLMENT_STATUS.ENROLLED);

      // Lần 2: Ghi danh trùng lặp với cùng userId và courseId -> Bị chặn với code 11000
      let duplicateErr;
      try {
        await Enrollment.create({
          userId: user._id,
          courseId: course._id
        });
      } catch (e) {
        duplicateErr = e;
      }

      assert.ok(duplicateErr, 'Database phải chặn ghi danh trùng lặp');
      assert.equal(duplicateErr.code, 11000, 'Lỗi phải là mã 11000 (duplicate key error)');
    });
  });

  describe('5. Kiểm tra Seed Data (DEVELOPMENT_PLAN Bước 1.3)', () => {
    it('Seed Users: Phải có đủ 1 tài khoản Admin và 1 Student theo đúng thông tin đề bài', () => {
      assert.equal(seedUsers.length, 2);
      const admin = seedUsers.find((u) => u.role === ROLES.ADMIN);
      const student = seedUsers.find((u) => u.role === ROLES.STUDENT);

      assert.ok(admin, 'Phải có tài khoản Admin');
      assert.equal(admin.email, 'admin@pks.edu.vn');
      assert.equal(admin.password, 'Admin@123');

      assert.ok(student, 'Phải có tài khoản Student');
      assert.equal(student.email, 'student@pks.edu.vn');
      assert.equal(student.password, 'Student@123');
    });

    it('Seed Courses: Phải có đúng 8 khóa học mẫu với đầy đủ thông tin chuẩn', () => {
      assert.equal(seedCourses.length, 8, 'Phải có chính xác 8 khóa học mẫu');
      seedCourses.forEach((c) => {
        assert.ok(c.title && c.title.trim().length > 0, 'Tiêu đề không được rỗng');
        assert.ok(c.category && c.category.trim().length > 0, 'Danh mục không được rỗng');
        assert.ok(c.instructor && c.instructor.trim().length > 0, 'Giảng viên không được rỗng');
        assert.ok(typeof c.tuitionFee === 'number' && c.tuitionFee >= 0, 'Học phí phải >= 0');
        assert.ok(typeof c.capacity === 'number' && c.capacity >= 1, 'Sức chứa phải >= 1');
        assert.equal(c.enrolledCount, 0, 'enrolledCount ban đầu = 0');
        assert.equal(c.status, COURSE_STATUS.ACTIVE, 'Trạng thái ban đầu = active');
      });
    });
  });
});
