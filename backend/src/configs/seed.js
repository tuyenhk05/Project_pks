const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('./database');
const User = require('../models/users.model');
const Course = require('../models/courses.model');
const Enrollment = require('../models/enrollments.model');
const { ROLES, COURSE_STATUS } = require('./constants');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database collection data...');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    console.log('Creating admin user...');
    const adminUser = await User.create({
      fullName: 'PKS Admin',
      email: 'admin@pks.edu.vn',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      isActive: true,
    });

    console.log('Creating sample student user...');
    const studentUser = await User.create({
      fullName: 'Nguyen Van A',
      email: 'student@pks.edu.vn',
      password: 'Student@123',
      role: ROLES.STUDENT,
      isActive: true,
    });

    console.log('Creating sample courses...');
    const coursesData = [
      {
        title: 'React.js & Tailwind CSS cho Người Mới Bắt Đầu',
        category: 'Frontend',
        instructor: 'Trần Thị B',
        description: 'Khóa học xây dựng giao diện hiện đại với React 18, Vite và Tailwind CSS từ cơ bản đến nâng cao.',
        tuitionFee: 1500000,
        capacity: 30,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'Node.js & Express RESTful API Masterclass',
        category: 'Backend',
        instructor: 'Lê Văn C',
        description: 'Lập trình hệ thống backend quy mô thực tế với Node.js, Express, MongoDB và JWT Authentication.',
        tuitionFee: 2000000,
        capacity: 25,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'Lập Trình Fullstack Web Developer (Node.js + React)',
        category: 'Fullstack',
        instructor: 'Nguyễn Văn D',
        description: 'Lộ trình Fullstack toàn diện từ thiết kế CSDL MongoDB đến xây dựng ứng dụng Web hoàn chỉnh.',
        tuitionFee: 3500000,
        capacity: 20,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'Lập Trình Di Động Flutter Cross-Platform',
        category: 'Mobile',
        instructor: 'Phạm Minh E',
        description: 'Phát triển ứng dụng Android và iOS chất lượng cao với ngôn ngữ Dart và Flutter framework.',
        tuitionFee: 2500000,
        capacity: 15,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'DevOps & Docker cho Lập Trình Viên',
        category: 'DevOps',
        instructor: 'Hoàng Quốc F',
        description: 'Tối ưu hóa quy trình đóng gói container, CI/CD pipeline và triển khai ứng dụng lên server.',
        tuitionFee: 2800000,
        capacity: 10,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'Phân Tích Dữ Liệu Với Python & Pandas',
        category: 'Data Science',
        instructor: 'Đỗ Hoàng G',
        description: 'Thu thập, làm sạch, phân tích và trực quan hóa dữ liệu kinh doanh bằng Python.',
        tuitionFee: 1800000,
        capacity: 25,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'TypeScript Chuyên Sâu Cho React & Node.js',
        category: 'Fullstack',
        instructor: 'Trịnh Văn H',
        description: 'Nâng cao độ tin cậy và chuẩn hóa kiểu dữ liệu cho toàn bộ hệ thống web fullstack với TypeScript.',
        tuitionFee: 2200000,
        capacity: 20,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
      {
        title: 'Khóa Học Giới Hạn Suất (Demo Race Condition)',
        category: 'Testing',
        instructor: 'PKS System',
        description: 'Khóa học phục vụ testing sức chứa tối đa và đăng ký suất cuối.',
        tuitionFee: 500000,
        capacity: 2,
        enrolledCount: 0,
        status: COURSE_STATUS.ACTIVE,
      },
    ];

    await Course.insertMany(coursesData);

    console.log('✅ Seed data successfully completed!');
    console.log(`Admin account: admin@pks.edu.vn / Admin@123`);
    console.log(`Student account: student@pks.edu.vn / Student@123`);
    console.log(`Total courses created: ${coursesData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
