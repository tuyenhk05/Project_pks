# ⚙️ Quy chuẩn 02: Kiến trúc Backend — PKS Course Portal

---

## 🏛️ 1. Mô hình Kiến trúc Phân tầng

```text
HTTP Client (React.js / Postman)
       │
       ▼
┌──────────────┐
│  Express App │  → CORS, Helmet, JSON Parser, Rate Limit
└──────┬───────┘
       │
  Router Layer  → Client: /api/v1/*  |  Admin: /admin/*
       │
Middleware Layer→ authenticate → requireAdmin/requireStudent → validate
       │
Controller Layer→ Client Controllers  |  Admin Controllers
       │
  Model Layer   → Mongoose Models (Users, Courses, Enrollments)
       │
   MongoDB      → Atlas Cloud / Local MongoDB
```

---

## 🔀 2. Route Mounting

### Client Routes (prefix: `/api/v1`)
```
/api/v1/auth/register       POST   Đăng ký
/api/v1/auth/login           POST   Đăng nhập
/api/v1/auth/logout          POST   Đăng xuất
/api/v1/auth/me              GET    Thông tin cá nhân
/api/v1/courses              GET    Danh sách khóa học
/api/v1/courses/:id          GET    Chi tiết khóa học
/api/v1/enrollments          POST   Ghi danh
/api/v1/enrollments/my-courses GET  Khóa học đã ghi danh
```

### Admin Routes (prefix: `/admin`)
```
/admin/auth/login                    POST   Đăng nhập Admin
/admin/courses                       GET    Danh sách (Admin view)
/admin/courses                       POST   Tạo khóa học
/admin/courses/:id                   PUT    Sửa khóa học
/admin/courses/:id                   DELETE Xóa/ẩn khóa học
/admin/enrollments                   GET    Tất cả ghi danh
/admin/enrollments/course/:courseId   GET    Ghi danh theo khóa
```

---

## 🗄️ 3. Mongoose Model Patterns

### Quy chuẩn Schema:
1. Khai báo kiểu dữ liệu chặt chẽ (`required`, `unique`, `enum`, `default`)
2. Bật `timestamps: true` → tự động `createdAt`, `updatedAt`
3. Pre-save hook cho password hashing (Users model)
4. Compound unique index cho chống ghi danh trùng (Enrollments model)
5. Virtuals cho computed fields (Course: `isFull`, `availableSlots`)

### Mẫu User Model:
```javascript
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Pre-save: hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method: so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## 🛡️ 4. Xử lý Lỗi Toàn cục

```javascript
// middlewares/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} đã tồn tại trong hệ thống`;
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID không hợp lệ';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Token không hợp lệ'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token đã hết hạn'; }

  res.status(statusCode).json({ success: false, message });
};
```

---

## 🔒 5. Bảy Nguyên Tắc Bảo Mật Backend

1. **Chống IDOR**: Lấy `userId` từ `req.user.id` (JWT), KHÔNG từ `req.body.userId`
2. **Atomic Update cho Enrollment**: Dùng `findOneAndUpdate` với `$lt` + `$inc` chống Race Condition
3. **escapeRegex**: Escape ký tự đặc biệt trong search query trước khi tạo RegExp
4. **bcrypt salt >= 10**: Hash password đủ rounds
5. **JWT expiration**: Token phải có `expiresIn`
6. **Input Validation**: Validate mọi input bằng Joi trước khi xử lý
7. **Capacity Check**: Khi update course, `capacity` >= `enrolledCount`

---

## 📅 6. Date Format

Đề bài yêu cầu: `YYYY-MM-DD` theo múi giờ `Asia/Ho_Chi_Minh`

```javascript
// utils hoặc khi trả response
const formatDate = (date) => {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date(date));
};
```

---

*Kiến trúc Backend chuẩn hóa giúp hệ thống hoạt động ổn định, bảo mật và dễ mở rộng.*
