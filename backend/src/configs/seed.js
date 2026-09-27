const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Tải biến môi trường
dotenv.config();

const connectDB = require('./database');
const { ROLES, COURSE_STATUS } = require('./constants');
const User = require('../models/users.model');
const Course = require('../models/courses.model');
const Enrollment = require('../models/enrollments.model');

const seedUsers = [
  {
    fullName: 'PKS Admin',
    email: 'admin@pks.edu.vn',
    password: 'Admin@123',
    role: ROLES.ADMIN
  },
  {
    fullName: 'Nguyen Van A',
    email: 'student@pks.edu.vn',
    password: 'Student@123',
    role: ROLES.STUDENT
  }
];

const seedCourses = [
  {
    title: 'Lập trình Node.js & Express Chuyên Sâu',
    category: 'Backend',
    instructor: 'ThS. Trần Văn Nam',
    description: 'Xây dựng RESTful API chuyên nghiệp, bảo mật với JWT, RBAC và tối ưu cơ sở dữ liệu MongoDB.',
    tuitionFee: 3500000,
    capacity: 30,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'React.js & State Management Toàn Diện',
    category: 'Frontend',
    instructor: 'Lê Thị Hương',
    description: 'Làm chủ React 18, React Router v6, Context API, Hooks nâng cao và thiết kế UI hiện đại với Tailwind CSS.',
    tuitionFee: 3200000,
    capacity: 25,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'Fullstack Web Developer (MERN Stack)',
    category: 'Fullstack',
    instructor: 'ThS. Trần Văn Nam',
    description: 'Học từ số 0 đến tự xây dựng ứng dụng Web hoàn chỉnh kết hợp React, Node.js, Express và MongoDB.',
    tuitionFee: 5500000,
    capacity: 20,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'TypeScript & Clean Architecture Thực Chiến',
    category: 'Architecture',
    instructor: 'Phạm Đức Minh',
    description: 'Áp dụng TypeScript và Design Patterns để xây dựng hệ thống phần mềm mở rộng tốt, dễ bảo trì.',
    tuitionFee: 2800000,
    capacity: 30,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'DevOps & Docker, CI/CD Pipeline',
    category: 'DevOps',
    instructor: 'Hoàng Văn Khải',
    description: 'Container hóa ứng dụng với Docker, thiết lập CI/CD tự động và triển khai lên môi trường Cloud.',
    tuitionFee: 4000000,
    capacity: 20,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'Lập trình Ứng Dụng Di Động với Flutter & Dart',
    category: 'Mobile',
    instructor: 'Đỗ Quỳnh Anh',
    description: 'Phát triển ứng dụng iOS và Android đa nền tảng với hiệu năng cao từ một mã nguồn duy nhất.',
    tuitionFee: 3800000,
    capacity: 25,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'Python cho Khoa Học Dữ Liệu & Trí Tuệ Nhân Tạo',
    category: 'AI & Data',
    instructor: 'TS. Nguyễn Minh Tuấn',
    description: 'Phân tích dữ liệu với Pandas, NumPy, trực quan hóa và xây dựng các mô hình Machine Learning cơ bản.',
    tuitionFee: 4500000,
    capacity: 25,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  },
  {
    title: 'Cấu Trúc Dữ Liệu & Thuật Toán Ứng Dụng',
    category: 'Computer Science',
    instructor: 'TS. Nguyễn Minh Tuấn',
    description: 'Nâng cao tư duy giải quyết vấn đề, chuẩn bị cho các vòng phỏng vấn kỹ thuật thuật toán chuyên sâu.',
    tuitionFee: 2500000,
    capacity: 15,
    enrolledCount: 0,
    status: COURSE_STATUS.ACTIVE
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Đang dọn dẹp dữ liệu cũ...');

    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({})
    ]);

    console.log('[Seed] Đang tạo người dùng mẫu (Admin & Student)...');
    // Dùng User.create để kích hoạt pre('save') hook mã hóa bcrypt
    for (const userData of seedUsers) {
      await User.create(userData);
    }
    console.log(`[Seed] ✅ Đã tạo ${seedUsers.length} người dùng thành công.`);

    console.log('[Seed] Đang tạo 8 khóa học mẫu...');
    const createdCourses = await Course.insertMany(seedCourses);
    console.log(`[Seed] ✅ Đã tạo ${createdCourses.length} khóa học thành công.`);

    console.log('[Seed] 🎉 Dữ liệu mẫu đã được khởi tạo thành công!');
    await mongoose.disconnect();
    console.log('[Seed] Đã ngắt kết nối cơ sở dữ liệu.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] ❌ Thất bại khi tạo seed data: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Chạy trực tiếp nếu file được gọi từ CLI
if (require.main === module) {
  seedData();
}

module.exports = { seedData, seedUsers, seedCourses };
