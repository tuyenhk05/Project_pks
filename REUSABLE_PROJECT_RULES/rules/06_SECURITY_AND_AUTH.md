# 🛡️ Quy chuẩn 06: Bảo mật & Phân quyền — PKS Course Portal

---

## 🔐 1. Xác thực (Authentication)

### JWT Token
```
Authorization: Bearer <jwt_token>
```

- Token chứa: `{ userId, role }` — KHÔNG chứa password
- Token phải có `expiresIn` (ví dụ: `7d`)
- Verify token bằng `jsonwebtoken.verify(token, JWT_SECRET)`

### Mã hóa Password
```javascript
// Pre-save hook trong User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // salt >= 10
  next();
});
```

- **TUYỆT ĐỐI không lưu password plaintext**
- bcrypt salt rounds **>= 10** (yêu cầu đề bài)
- Không trả password trong response (dùng `select: false` trong schema)

---

## 👥 2. Phân quyền RBAC (Role-Based Access Control)

### Roles trong hệ thống:

| Role | Quyền |
|------|-------|
| `student` | Xem khóa học, ghi danh, xem khóa học đã đăng ký |
| `admin` | Toàn quyền CRUD khóa học, xem tất cả ghi danh |
| `staff` | Tương tự admin (có thể giới hạn sau) |

### Middleware xác thực 2 lớp:

```javascript
// Lớp 1: authenticate — verify JWT
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Lớp 2: requireAdmin — chặn Student
const requireAdmin = (req, res, next) => {
  if (req.user.role === 'student') {
    return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
  }
  next();
};

// Lớp 2b: requireStudent
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Chức năng dành cho học viên' });
  }
  next();
};
```

### Route được bảo vệ:
```javascript
// Admin routes — 2 lớp middleware
router.post('/courses', authenticate, requireAdmin, coursesController.create);
router.put('/courses/:id', authenticate, requireAdmin, coursesController.update);
router.delete('/courses/:id', authenticate, requireAdmin, coursesController.delete);

// Student routes — authenticate + requireStudent
router.post('/enrollments', authenticate, requireStudent, enrollmentsController.enroll);
router.get('/enrollments/my-courses', authenticate, requireStudent, enrollmentsController.myCourses);
```

---

## 🎯 3. Chống IDOR (Insecure Direct Object Reference)

### Nguyên tắc:
> Khi Student thao tác trên dữ liệu cá nhân, **BẮT BUỘC lấy `userId` từ JWT (`req.user.id`)**

```javascript
// ✅ ĐÚNG — lấy từ JWT
const enrollments = await Enrollment.find({ userId: req.user.id });

// ❌ SAI — lấy từ body (client có thể giả mạo)
const enrollments = await Enrollment.find({ userId: req.body.userId });
```

### Áp dụng cho:
- Ghi danh khóa học → `userId = req.user.id`
- Xem khóa học đã đăng ký → `userId = req.user.id`
- Student KHÔNG được xem enrollment của user khác

---

## 🔒 4. Chống Race Condition khi Ghi danh

```javascript
// Atomic Update — an toàn cho concurrent requests
const course = await Course.findOneAndUpdate(
  {
    _id: courseId,
    status: 'active',
    $expr: { $lt: ['$enrolledCount', '$capacity'] }
  },
  { $inc: { enrolledCount: 1 } },
  { new: true }
);

if (!course) {
  return res.status(400).json({
    success: false,
    message: 'Khóa học đã hết chỗ hoặc không tồn tại'
  });
}
```

---

## 🛡️ 5. HTTP Security Headers

```javascript
// server.js
const helmet = require('helmet');
app.use(helmet());

// CORS
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL, // Chỉ cho phép frontend URL
  credentials: true
}));

// Rate Limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100
}));
```

---

## 🔍 6. Chống ReDoS

```javascript
// utils/regex.util.js
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Sử dụng khi search
const searchRegex = new RegExp(escapeRegex(query.trim()), 'i');
const courses = await Course.find({ title: searchRegex });
```

---

## 📋 7. Input Validation

```javascript
// validations/auth.validation.js
const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.empty': 'Họ tên không được để trống' }),
  email: Joi.string().email().lowercase().required()
    .messages({ 'string.email': 'Email không hợp lệ' }),
  password: Joi.string().min(6).required()
    .messages({ 'string.min': 'Mật khẩu phải có ít nhất 6 ký tự' })
});
```

---

*Tuân thủ bảo mật giúp hệ thống đạt điểm cao ở hạng mục Phân quyền & Bảo mật (1.5đ).*
