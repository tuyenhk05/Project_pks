# 🎯 KẾ HOẠCH PHÁT TRIỂN DỰ ÁN: PKS Course & Enrollment Portal

> **Vị trí**: Thực Tập Sinh Fullstack Developer (Node.js + React.js)  
> **Thời gian làm bài**: 36 giờ  
> **Hình thức nộp**: GitHub Repository public + link Demo  

---

## 📋 1. TÓM TẮT ĐỀ BÀI

Xây dựng **mini web-app "PKS Course & Enrollment Portal"** phục vụ tra cứu, quản lý và ghi danh các khóa học công nghệ.

### Hai vai trò chính:
- **Student (Học viên)**: Đăng ký, đăng nhập, xem khóa học, ghi danh, xem khóa học đã đăng ký
- **Admin/Staff (Quản trị)**: Quản lý khóa học (CRUD), quản lý danh sách ghi danh

### Thang điểm (10 điểm):

| Hạng mục | Điểm | Trọng tâm Intern | Tiêu chí nâng cao |
|----------|-------|-------------------|-------------------|
| Backend & CSDL | 3.0 | ERD hợp lý (0.75đ); REST API CRUD & Auth (1.25đ); xử lý trùng lặp và sức chứa (1.0đ) | Transaction chống Race Condition; Input Validation; xử lý Date đúng |
| Frontend & UI/UX | 2.5 | Responsive (1.0đ); gọi API danh sách & chi tiết (1.0đ); Login/Logout (0.5đ) | Đầy đủ Loading/Empty/Disabled; Toast; Code splitting |
| Phân quyền & Bảo mật | 1.5 | Tách biệt Admin/Student (0.75đ); Protected Routes & JWT Middleware (0.75đ) | Bcrypt salt >= 10; RBAC; bảo mật .env |
| Kiểm thử Postman | 1.5 | Postman Collection đầy đủ luồng (0.75đ); ảnh test CRUD và mã lỗi (0.75đ) | Unit/Integration Test bằng Jest, Vitest hoặc Supertest (+0.5đ bonus) |
| Git & Clean Code | 1.5 | Cấu trúc source rõ ràng (0.75đ); README chuyên nghiệp (0.75đ) | Conventional Commits; .env.example; không bulk dump source |

---

## 🛠️ 2. TECH STACK LỰA CHỌN

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| **Frontend** | React.js + Vite | Đề bài khuyến nghị React, Vite build nhanh |
| **CSS Framework** | Tailwind CSS | Responsive nhanh, utility-first, không cần viết CSS riêng |
| **Routing FE** | React Router v6+ | Đề bài yêu cầu Protected Routes |
| **State Management** | React Context API | Đủ cho app quy mô nhỏ, không cần Redux |
| **HTTP Client** | Axios | Interceptors tốt, tự động gắn token, xử lý lỗi |
| **Toast Notification** | React-Toastify | Đề bài yêu cầu Toast, không dùng `alert()` |
| **Backend** | Node.js + Express | Đề bài yêu cầu Node.js |
| **Database** | MongoDB + Mongoose | Linh hoạt, dễ setup, hỗ trợ Transaction & Atomic Update |
| **Auth** | JWT + bcryptjs | Đề bài yêu cầu JWT + bcrypt salt >= 10 |
| **Validation** | Joi | Input validation chặt chẽ, dễ đọc |
| **Testing** | Postman + (Jest bonus) | Đề bài yêu cầu Postman Collection |

---

## 🏗️ 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
f:\test_pks\
├── backend/                            # ===== NODE.JS + EXPRESS API =====
│   ├── src/
│   │   ├── configs/
│   │   │   ├── database.js             # Kết nối MongoDB
│   │   │   ├── constants.js            # Hằng số hệ thống (ROLES, STATUS...)
│   │   │   └── seed.js                 # Tạo dữ liệu mẫu (Admin + Student + Courses)
│   │   │
│   │   ├── controllers/
│   │   │   ├── admin/
│   │   │   │   ├── auth.controller.js      # Đăng nhập Admin
│   │   │   │   ├── courses.controller.js   # CRUD khóa học (Admin)
│   │   │   │   └── enrollments.controller.js # Xem danh sách ghi danh
│   │   │   └── client/
│   │   │       ├── auth.controller.js      # Đăng ký / Đăng nhập / Đăng xuất Student
│   │   │       ├── courses.controller.js   # Xem danh sách + chi tiết khóa học
│   │   │       └── enrollments.controller.js # Ghi danh + Xem khóa học của tôi
│   │   │
│   │   ├── helpers/
│   │   │   ├── pagination.helper.js    # Hàm tính toán phân trang
│   │   │   └── response.helper.js      # Hàm format response chuẩn
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # authenticate, requireAdmin, requireStudent
│   │   │   ├── validate.middleware.js   # Middleware validate request body
│   │   │   └── errorHandler.middleware.js # Global error handler
│   │   │
│   │   ├── models/
│   │   │   ├── users.model.js          # Schema User (fullName, email, password, role)
│   │   │   ├── courses.model.js        # Schema Course (title, category, instructor, capacity...)
│   │   │   └── enrollments.model.js    # Schema Enrollment (userId, courseId, status, enrolledAt)
│   │   │
│   │   ├── routes/
│   │   │   ├── admin/
│   │   │   │   ├── auth.route.js
│   │   │   │   ├── courses.route.js
│   │   │   │   └── enrollments.route.js
│   │   │   ├── client/
│   │   │   │   ├── auth.route.js
│   │   │   │   ├── courses.route.js
│   │   │   │   └── enrollments.route.js
│   │   │   └── index.js                # Mount tất cả routes
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.util.js             # signToken, verifyToken
│   │   │   └── regex.util.js           # escapeRegex chống ReDoS
│   │   │
│   │   └── validations/
│   │       ├── auth.validation.js      # Validate register, login
│   │       └── course.validation.js    # Validate create, update course
│   │
│   ├── server.js                       # Entry point - khởi tạo Express app
│   ├── .env.example                    # Mẫu biến môi trường
│   ├── .gitignore
│   └── package.json
│
├── frontend/                           # ===== REACT.JS + VITE =====
│   ├── src/
│   │   ├── assets/                     # Ảnh tĩnh, logo, icons
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── CourseFormModal.jsx      # Modal tạo/sửa khóa học
│   │   │   │   └── EnrollmentTable.jsx     # Bảng danh sách ghi danh
│   │   │   ├── client/
│   │   │   │   ├── CourseCard.jsx           # Card hiển thị khóa học
│   │   │   │   ├── CourseFilter.jsx         # Tìm kiếm + lọc danh mục
│   │   │   │   └── EnrollButton.jsx         # Nút ghi danh (có disabled state)
│   │   │   ├── common/
│   │   │   │   ├── ErrorBoundary.jsx        # Bắt crash → fallback UI
│   │   │   │   ├── LoadingSpinner.jsx       # Spinner khi loading
│   │   │   │   ├── EmptyState.jsx           # Hiển thị khi không có dữ liệu
│   │   │   │   └── ProtectedRoute.jsx       # Guard route theo role
│   │   │   └── layout/
│   │   │       ├── ClientLayout.jsx         # Layout cho Student (Header + Footer)
│   │   │       ├── AdminLayout.jsx          # Layout cho Admin (Sidebar + Topbar)
│   │   │       └── Navbar.jsx               # Thanh điều hướng
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js                   # Hook quản lý auth state
│   │   │   └── useFetch.js                  # Hook gọi API có loading/error state
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLoginPage.jsx       # Trang đăng nhập Admin
│   │   │   │   ├── AdminDashboard.jsx       # Dashboard thống kê
│   │   │   │   ├── CoursesManagement.jsx    # Quản lý khóa học (Table + CRUD)
│   │   │   │   └── EnrollmentsManagement.jsx # Quản lý ghi danh
│   │   │   └── client/
│   │   │       ├── HomePage.jsx             # Danh sách khóa học + search + filter
│   │   │       ├── CourseDetailPage.jsx     # Chi tiết khóa học + nút Ghi danh
│   │   │       ├── LoginPage.jsx            # Đăng nhập Student
│   │   │       ├── RegisterPage.jsx         # Đăng ký Student
│   │   │       └── MyCoursesPage.jsx        # Khóa học đã ghi danh
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx                # Cấu hình React Router + Guards
│   │   │
│   │   ├── services/
│   │   │   ├── admin/
│   │   │   │   ├── auth.service.js          # adminLogin
│   │   │   │   ├── courses.service.js       # CRUD courses (Admin)
│   │   │   │   └── enrollments.service.js   # getEnrollments (Admin)
│   │   │   └── client/
│   │   │       ├── auth.service.js          # register, login, logout, getMe
│   │   │       ├── courses.service.js       # getCourses, getCourseById
│   │   │       └── enrollments.service.js   # enroll, getMyEnrollments
│   │   │
│   │   ├── store/
│   │   │   └── AuthContext.jsx              # Context quản lý user, token, role
│   │   │
│   │   ├── utils/
│   │   │   ├── httpClient.js                # Axios instance + interceptors
│   │   │   └── formatters.js                # Format date, currency
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docs/                               # ===== TÀI LIỆU DỰ ÁN =====
│   ├── ERD.png                         # Entity Relationship Diagram
│   ├── PKS_Course_Portal.postman_collection.json
│   └── screenshots/                    # Ảnh kết quả kiểm thử
│       ├── auth-register.png
│       ├── auth-login.png
│       ├── courses-list.png
│       ├── enrollment-success.png
│       ├── enrollment-duplicate-error.png
│       ├── enrollment-full-error.png
│       └── admin-crud.png
│
├── REUSABLE_PROJECT_RULES/             # ===== QUY CHUẨN DỰ ÁN =====
│   ├── PROJECT_RULES_MASTER.md         # File chỉ mục trung tâm (đã customize)
│   ├── rules/
│   │   ├── 01_FOLDER_STRUCTURE.md
│   │   ├── 02_BACKEND_ARCHITECTURE.md
│   │   ├── 03_FRONTEND_ARCHITECTURE.md
│   │   ├── 04_FEATURE_DECOMPOSITION.md
│   │   ├── 05_ENVIRONMENT_CONFIG.md
│   │   ├── 06_SECURITY_AND_AUTH.md
│   │   └── 07_CODING_STANDARDS.md
│   └── skills/
│       ├── ADD_NEW_FEATURE_MODULE.md
│       └── ENROLLMENT_RACE_CONDITION.md  # Skill mới: xử lý Race Condition
│
├── .gitignore                          # Root gitignore
├── DEVELOPMENT_PLAN.md                 # File này
└── README.md                           # Hướng dẫn cài đặt & demo
```

---

## 🗄️ 4. THIẾT KẾ DATABASE (ERD)

### 4.1. Sơ đồ quan hệ thực thể

```
┌─────────────────────────┐       ┌─────────────────────────┐
│         USERS            │       │        COURSES           │
├─────────────────────────┤       ├─────────────────────────┤
│ _id        : ObjectId PK│       │ _id          : ObjectId PK│
│ fullName   : String      │       │ title        : String     │
│ email      : String (UK) │       │ category     : String     │
│ password   : String      │       │ instructor   : String     │
│ role       : Enum        │       │ description  : String     │
│   [student|admin|staff]  │       │ tuitionFee   : Number     │
│ isActive   : Boolean     │       │ capacity     : Number     │
│ createdAt  : Date        │       │ enrolledCount: Number     │
│ updatedAt  : Date        │       │ status       : Enum       │
└──────────┬──────────────┘       │   [active|inactive|hidden]│
           │                       │ createdAt    : Date       │
           │  1:N                  │ updatedAt    : Date       │
           │                       └──────────┬──────────────┘
           │                                  │
           │              N:1                 │  1:N
           ▼                                  ▼
┌──────────────────────────────────────────────┐
│                ENROLLMENTS                    │
├──────────────────────────────────────────────┤
│ _id          : ObjectId PK                    │
│ userId       : ObjectId FK → USERS            │
│ courseId      : ObjectId FK → COURSES          │
│ status       : Enum [enrolled|cancelled|completed] │
│ enrolledAt   : Date                           │
│ createdAt    : Date                           │
│ updatedAt    : Date                           │
│                                               │
│ 🔒 UNIQUE INDEX: { userId, courseId }          │
│    → Chặn đăng ký trùng ở database level     │
└──────────────────────────────────────────────┘
```

### 4.2. Ràng buộc quan trọng

| Ràng buộc | Thực thể | Mô tả |
|-----------|----------|-------|
| **Unique email** | Users | Không cho phép 2 user cùng email |
| **Compound Unique** | Enrollments | `{ userId, courseId }` → chặn ghi danh trùng |
| **Pre-save hook** | Users | Hash password bằng bcrypt (salt >= 10) trước khi lưu |
| **Default value** | Courses | `enrolledCount` mặc định = 0 |
| **Constraint** | Courses | `enrolledCount` không vượt quá `capacity` |
| **Timestamps** | Tất cả | Tự động tạo `createdAt`, `updatedAt` |

---

## 📡 5. DANH SÁCH API ENDPOINTS

### 5.1. Client API (Student) — Prefix: `/api/v1`

| # | Method | Endpoint | Mô tả | Auth |
|---|--------|----------|-------|------|
| 1 | POST | `/api/v1/auth/register` | Đăng ký tài khoản (fullName, email, password) | ❌ |
| 2 | POST | `/api/v1/auth/login` | Đăng nhập → trả JWT token | ❌ |
| 3 | POST | `/api/v1/auth/logout` | Đăng xuất | ✅ |
| 4 | GET | `/api/v1/auth/me` | Lấy thông tin user đang đăng nhập | ✅ |
| 5 | GET | `/api/v1/courses` | Danh sách khóa học (search, filter, pagination) | ❌ |
| 6 | GET | `/api/v1/courses/:id` | Chi tiết một khóa học | ❌ |
| 7 | POST | `/api/v1/enrollments` | Ghi danh vào khóa học | ✅ Student |
| 8 | GET | `/api/v1/enrollments/my-courses` | Danh sách khóa học đã ghi danh | ✅ Student |

### 5.2. Admin API — Prefix: `/admin`

| # | Method | Endpoint | Mô tả | Auth |
|---|--------|----------|-------|------|
| 1 | POST | `/admin/auth/login` | Đăng nhập Admin/Staff | ❌ |
| 2 | GET | `/admin/courses` | Danh sách tất cả khóa học (Admin view) | ✅ Admin |
| 3 | POST | `/admin/courses` | Tạo khóa học mới | ✅ Admin |
| 4 | PUT | `/admin/courses/:id` | Chỉnh sửa khóa học | ✅ Admin |
| 5 | DELETE | `/admin/courses/:id` | Xóa / ẩn khóa học | ✅ Admin |
| 6 | GET | `/admin/enrollments` | Danh sách tất cả ghi danh | ✅ Admin |
| 7 | GET | `/admin/enrollments/course/:courseId` | Danh sách học viên theo khóa học | ✅ Admin |

### 5.3. Chuẩn Response API

```javascript
// ✅ Thành công
{
  "success": true,
  "message": "Lấy danh sách khóa học thành công",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "limit": 10
  }
}

// ❌ Thất bại
{
  "success": false,
  "message": "Email đã tồn tại trong hệ thống"
}
```

---

## ⏰ 6. TIMELINE PHÁT TRIỂN (36 giờ)

```
Phase 0 (1.5h)  ──►  Phase 1 (2h)  ──►  Phase 2 (8h)  ──►  Phase 3 (10h)  ──►  Phase 4 (2h)  ──►  Phase 5 (3h)  ──►  Phase 6 (2h)
  Setup               DB/Models          Backend API          Frontend             Security           Testing             Docs
                                                                                                                        ──► Buffer 7.5h
```

| Phase | Thời gian | Tích lũy | Nội dung chính |
|-------|-----------|----------|---------------|
| **Phase 0** | 1.5h | 1.5h | Init project, Git, npm install, cấu hình `.env` |
| **Phase 1** | 2.0h | 3.5h | ERD, Mongoose Models, Seed data (Admin + Student + Courses) |
| **Phase 2** | 8.0h | 11.5h | Auth API, Courses API, Enrollment API (Client + Admin) |
| **Phase 3** | 10.0h | 21.5h | Routing, Pages, Components, Services, UX states |
| **Phase 4** | 2.0h | 23.5h | RBAC middleware, Protected Routes, Security checklist |
| **Phase 5** | 3.0h | 26.5h | Postman Collection, Screenshots, (Unit Test bonus) |
| **Phase 6** | 2.0h | 28.5h | README, ERD diagram export, Final review |
| **Buffer** | 7.5h | 36h | Debug, polish, edge cases, unexpected issues |

---

## 📦 7. CHI TIẾT TỪNG PHASE

### PHASE 0 — KHỞI TẠO DỰ ÁN (~1.5 giờ)

**Bước 0.1: Tạo cấu trúc thư mục**
```bash
mkdir backend backend/src frontend docs
mkdir backend/src/{configs,controllers,helpers,middlewares,models,routes,utils,validations}
mkdir backend/src/controllers/{admin,client}
mkdir backend/src/routes/{admin,client}
```

**Bước 0.2: Khởi tạo Git**
```bash
git init
git add .gitignore README.md
git commit -m "chore: initialize project structure"
```

**Bước 0.3: Setup Backend**
```bash
cd backend
npm init -y
npm install express mongoose dotenv cors helmet bcryptjs jsonwebtoken cookie-parser express-rate-limit joi
npm install -D nodemon
```

Thêm vào `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "seed": "node src/configs/seed.js"
  }
}
```

**Bước 0.4: Setup Frontend**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios react-router-dom react-toastify react-icons
npm install -D tailwindcss @tailwindcss/vite
```

**Bước 0.5: Cấu hình .env.example**

`backend/.env.example`:
```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pks_courses?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

`frontend/.env.example`:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ADMIN_API_URL=http://localhost:3000/admin
```

**Git commit**: `chore: setup backend and frontend dependencies`

---

### PHASE 1 — DATABASE & MODELS (~2 giờ)

**Bước 1.1: Kết nối Database** — `backend/src/configs/database.js`
- Kết nối MongoDB bằng `mongoose.connect(process.env.DATABASE_URI)`
- Log thành công / thất bại

**Bước 1.2: Tạo Models**

`users.model.js`:
```javascript
// Schema: fullName (required), email (required, unique, lowercase),
//         password (required, min 6), role (enum: student/admin/staff, default: student),
//         isActive (default: true)
// Hooks: pre('save') → bcrypt.hash(password, 10)
// Methods: comparePassword(candidatePassword)
// Transforms: toJSON → loại bỏ password
// Timestamps: true
```

`courses.model.js`:
```javascript
// Schema: title (required), category (required), instructor (required),
//         description, tuitionFee (required, min 0), capacity (required, min 1),
//         enrolledCount (default 0, min 0), status (enum: active/inactive/hidden, default: active)
// Virtuals: availableSlots → capacity - enrolledCount
//           isFull → enrolledCount >= capacity
// Timestamps: true
```

`enrollments.model.js`:
```javascript
// Schema: userId (ref: User, required), courseId (ref: Course, required),
//         status (enum: enrolled/cancelled/completed, default: enrolled),
//         enrolledAt (default: Date.now)
// Index: { userId: 1, courseId: 1 } UNIQUE → chặn ghi danh trùng
// Timestamps: true
```

**Bước 1.3: Tạo Seed Data** — `backend/src/configs/seed.js`
```javascript
// 1. Tạo Admin: { fullName: "PKS Admin", email: "admin@pks.edu.vn", password: "Admin@123", role: "admin" }
// 2. Tạo Student: { fullName: "Nguyen Van A", email: "student@pks.edu.vn", password: "Student@123", role: "student" }
// 3. Tạo 8 khóa học mẫu với đầy đủ category, instructor, tuitionFee, capacity
```

**Git commit**: `feat: add database models and seed data`

---

### PHASE 2 — BACKEND API (~8 giờ)

**Bước 2.1: Server Entry Point** — `backend/server.js`
```javascript
// 1. Load dotenv
// 2. Connect Database
// 3. Cấu hình Express: cors, helmet, json parser, rate limit
// 4. Mount routes: /api/v1/* (client), /admin/* (admin)
// 5. Global error handler
// 6. Listen port
```

**Bước 2.2: Helpers**
- `response.helper.js`: `sendSuccess(res, statusCode, message, data, pagination)`, `sendError(res, statusCode, message)`
- `pagination.helper.js`: `getPagination(page, limit, total)`

**Bước 2.3: Auth Middleware** — `middlewares/auth.middleware.js`

| Middleware | Logic |
|------------|-------|
| `authenticate` | Lấy token từ `Authorization: Bearer <token>` → verify → gắn `req.user` |
| `requireAdmin` | Kiểm tra `req.user.role` là `admin` hoặc `staff`, **chặn** `student` → 403 |
| `requireStudent` | Kiểm tra `req.user.role === 'student'` → 403 nếu không phải |

**Bước 2.4: Client Auth API**
```
POST /api/v1/auth/register
  → Validate input (Joi)
  → Check email tồn tại → 400
  → Hash password (bcrypt, salt 10) → tự động qua pre-save hook
  → Create user → trả JWT

POST /api/v1/auth/login
  → Validate input
  → Find user by email → 401 nếu không tìm thấy
  → Compare password → 401 nếu sai
  → Sign JWT → trả token + user info

GET /api/v1/auth/me
  → authenticate middleware
  → Trả user info (không có password)
```

**Bước 2.5: Client Courses API**
```
GET /api/v1/courses
  → Query params: search (tên), category (lọc), page, limit
  → Search: dùng regex (đã escape qua escapeRegex)
  → Filter: chỉ status = "active"
  → Pagination: skip, limit
  → Trả danh sách + pagination object

GET /api/v1/courses/:id
  → Validate ObjectId
  → Find by id → 404 nếu không tìm thấy
  → Trả chi tiết khóa học
```

**Bước 2.6: Client Enrollment API** ⚠️ Phần quan trọng nhất

```
POST /api/v1/enrollments
  → authenticate + requireStudent
  → Body: { courseId }
  → userId lấy từ req.user.id (KHÔNG từ body → chống IDOR)
  → Kiểm tra course tồn tại → 404
  → Kiểm tra đã ghi danh chưa → 400 "Bạn đã đăng ký khóa học này"
  → ATOMIC UPDATE: findOneAndUpdate với điều kiện enrolledCount < capacity
  → Nếu null → 400 "Khóa học đã hết chỗ"
  → Tạo Enrollment → trả 201

GET /api/v1/enrollments/my-courses
  → authenticate + requireStudent
  → userId = req.user.id
  → Find enrollments by userId, populate course info
  → Trả danh sách
```

**Bước 2.7: Admin API**
```
POST /admin/auth/login     → Tương tự client nhưng kiểm tra role !== student
GET  /admin/courses        → Danh sách tất cả (kể cả hidden)
POST /admin/courses        → Tạo mới, validate input
PUT  /admin/courses/:id    → Sửa, validate capacity >= enrolledCount
DELETE /admin/courses/:id  → Soft delete (chuyển status → hidden)
GET  /admin/enrollments    → Tất cả ghi danh, populate user + course
GET  /admin/enrollments/course/:courseId → Lọc theo khóa học
```

**Bước 2.8: Global Error Handler** — `middlewares/errorHandler.middleware.js`
```javascript
// Bắt tất cả lỗi → trả { success: false, message: "..." }
// Mongoose ValidationError → 400
// Mongoose CastError (invalid ObjectId) → 400
// JWT errors → 401
// Duplicate key → 400
// Production: không trả stack trace
```

**Git commits**:
- `feat: implement auth API with JWT and bcrypt`
- `feat: implement courses API with search and pagination`
- `feat: implement enrollment API with race condition handling`
- `feat: implement admin API for course and enrollment management`

---

### PHASE 3 — FRONTEND (~10 giờ)

**Bước 3.1: HTTP Client** — `utils/httpClient.js`
```javascript
// Tạo 2 Axios instances:
// 1. clientApi: baseURL = VITE_API_URL, interceptor gắn token
// 2. adminApi: baseURL = VITE_ADMIN_API_URL, interceptor gắn admin token
// Response interceptor: 401 → redirect login
```

**Bước 3.2: Auth Context** — `store/AuthContext.jsx`
```javascript
// State: user, token, isLoggedIn, isLoading
// Methods: login(email, password), register(fullName, email, password), logout()
// Persist: token + user trong localStorage
// Init: kiểm tra localStorage khi mount, gọi /auth/me để verify
```

**Bước 3.3: Routing** — `routes/AppRoutes.jsx`
```
/                        → ClientLayout → HomePage
/courses/:id             → ClientLayout → CourseDetailPage
/login                   → LoginPage
/register                → RegisterPage
/my-courses              → ProtectedRoute(student) → ClientLayout → MyCoursesPage

/admin/login             → AdminLoginPage
/admin/dashboard         → ProtectedRoute(admin) → AdminLayout → AdminDashboard
/admin/courses           → ProtectedRoute(admin) → AdminLayout → CoursesManagement
/admin/enrollments       → ProtectedRoute(admin) → AdminLayout → EnrollmentsManagement
```

**Bước 3.4: Student Pages**

| Page | Nội dung chính |
|------|---------------|
| `HomePage.jsx` | Grid CourseCard + search input + category select + pagination |
| `CourseDetailPage.jsx` | Thông tin đầy đủ + EnrollButton (disabled khi hết chỗ/đã đăng ký) |
| `LoginPage.jsx` | Form email + password, link sang Register, redirect sau login |
| `RegisterPage.jsx` | Form fullName + email + password, link sang Login |
| `MyCoursesPage.jsx` | Table/List các khóa học đã ghi danh + ngày + trạng thái |

**Bước 3.5: Admin Pages**

| Page | Nội dung chính |
|------|---------------|
| `AdminLoginPage.jsx` | Form đăng nhập riêng cho Admin |
| `AdminDashboard.jsx` | 3 card thống kê: Tổng khóa học, Tổng ghi danh, Tổng học viên |
| `CoursesManagement.jsx` | Table danh sách + nút Thêm/Sửa/Xóa + CourseFormModal |
| `EnrollmentsManagement.jsx` | Select khóa học → hiển thị bảng học viên đã ghi danh |

**Bước 3.6: UX States (BẮT BUỘC)**

Mỗi page/component gọi API phải xử lý đủ 4 trạng thái:
```
1. Loading    → <LoadingSpinner />
2. Empty      → <EmptyState message="Chưa có khóa học nào" />
3. Error      → Toast error + retry option
4. Disabled   → Button disabled + spinner khi đang submit
```

**Git commits**:
- `feat: setup frontend routing and layouts`
- `feat: implement auth pages and context`
- `feat: implement course listing and detail pages`
- `feat: implement enrollment flow`
- `feat: implement admin dashboard and course management`

---

### PHASE 4 — BẢO MẬT & PHÂN QUYỀN (~2 giờ)

**Checklist bảo mật:**

| # | Yêu cầu | File liên quan | Trạng thái |
|---|---------|---------------|-----------|
| 1 | bcrypt salt >= 10 | `models/users.model.js` | ☐ |
| 2 | JWT có `expiresIn` | `utils/jwt.util.js` | ☐ |
| 3 | ProtectedRoute kiểm tra role | `components/common/ProtectedRoute.jsx` | ☐ |
| 4 | authenticate middleware trên API | `middlewares/auth.middleware.js` | ☐ |
| 5 | requireAdmin chặn student | `middlewares/auth.middleware.js` | ☐ |
| 6 | userId từ `req.user.id` (chống IDOR) | `controllers/client/enrollments.controller.js` | ☐ |
| 7 | `.env` trong `.gitignore` | `.gitignore` | ☐ |
| 8 | Có `.env.example` | `backend/.env.example`, `frontend/.env.example` | ☐ |
| 9 | CORS whitelist `CLIENT_URL` | `server.js` | ☐ |
| 10 | escapeRegex cho search | `utils/regex.util.js` | ☐ |
| 11 | Input validation (Joi) | `validations/*.validation.js` | ☐ |
| 12 | Error response không trả stack trace | `middlewares/errorHandler.middleware.js` | ☐ |
| 13 | Logout dọn sạch localStorage | `store/AuthContext.jsx` | ☐ |
| 14 | ErrorBoundary bọc Router | `App.jsx` | ☐ |

**Git commit**: `feat: add security hardening and RBAC middleware`

---

### PHASE 5 — KIỂM THỬ & POSTMAN (~3 giờ)

**Bước 5.1: Tạo Postman Collection**

Tạo collection `PKS Course Portal` với 4 folder:

**Folder 1: Auth**
```
✅ Register Student mới → 201
✅ Register email trùng → 400
✅ Login Student → 200 + token
✅ Login sai password → 401
✅ Get Me (có token) → 200
✅ Get Me (không token) → 401
```

**Folder 2: Courses (Student)**
```
✅ Get all courses → 200
✅ Search by name → 200
✅ Filter by category → 200
✅ Get course by ID → 200
✅ Get course by invalid ID → 400/404
```

**Folder 3: Enrollments**
```
✅ Enroll thành công → 201
✅ Enroll trùng → 400
✅ Enroll khóa học hết chỗ → 400
✅ Enroll không có token → 401
✅ Get my courses → 200
```

**Folder 4: Admin**
```
✅ Admin login → 200
✅ Student token vào admin API → 403
✅ Create course → 201
✅ Update course → 200
✅ Update capacity < enrolledCount → 400
✅ Delete course → 200
✅ Get enrollments by course → 200
```

**Bước 5.2: Export & chụp screenshots**
- Export collection → `docs/PKS_Course_Portal.postman_collection.json`
- Chụp ảnh mỗi test case → `docs/screenshots/`

**Bước 5.3: (Bonus +0.5đ) Unit Test**
```bash
cd backend
npm install -D jest supertest
# Test: auth register, login, enrollment duplicate, enrollment capacity
```

**Git commit**: `test: add Postman collection and API test screenshots`

---

### PHASE 6 — TÀI LIỆU & HOÀN THIỆN (~2 giờ)

**Bước 6.1: README.md** (xem mẫu ở file README.md riêng)

**Bước 6.2: ERD Diagram**
- Tạo trên dbdiagram.io hoặc draw.io
- Export PNG → `docs/ERD.png`

**Bước 6.3: Final Review Checklist**

| # | Kiểm tra | Trạng thái |
|---|---------|-----------|
| 1 | Git có >= 10 commits, Conventional Commits | ☐ |
| 2 | Không có `.env` trong git history | ☐ |
| 3 | Có `.env.example` cho BE + FE | ☐ |
| 4 | README đầy đủ cài đặt + demo account | ☐ |
| 5 | Postman collection trong `/docs` | ☐ |
| 6 | Screenshots kết quả test | ☐ |
| 7 | Code clean, không `console.log` thừa | ☐ |
| 8 | Responsive trên mobile | ☐ |
| 9 | Loading/Empty/Error/Disabled states | ☐ |
| 10 | Toast notification (không alert) | ☐ |
| 11 | ErrorBoundary bọc Router | ☐ |
| 12 | Race condition xử lý ghi danh | ☐ |
| 13 | Date format YYYY-MM-DD, timezone Asia/Ho_Chi_Minh | ☐ |

**Git commit**: `docs: add README, ERD and finalize documentation`

---

## 🎯 8. ĐIỂM NHẤN KỸ THUẬT ĐỂ GHI ĐIỂM CAO

### 8.1. Race Condition khi ghi danh suất cuối
```javascript
// MongoDB Atomic Update — an toàn, không cần Transaction phức tạp
const course = await Course.findOneAndUpdate(
  {
    _id: courseId,
    status: 'active',
    $expr: { $lt: ['$enrolledCount', '$capacity'] }
  },
  { $inc: { enrolledCount: 1 } },
  { new: true, runValidators: true }
);

if (!course) {
  return res.status(400).json({
    success: false,
    message: 'Khóa học đã hết chỗ hoặc không tồn tại'
  });
}

// Chỉ tạo enrollment SAU KHI atomic update thành công
const enrollment = await Enrollment.create({
  userId: req.user.id,  // Lấy từ JWT, KHÔNG từ body
  courseId,
  enrolledAt: new Date()
});
```

### 8.2. Date Format theo yêu cầu đề
```javascript
// Format YYYY-MM-DD theo múi giờ Asia/Ho_Chi_Minh
const formatDate = (date) => {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date(date));
};
// 'sv-SE' locale tự động trả format YYYY-MM-DD
```

### 8.3. Compound Unique Index
```javascript
// Chặn ghi danh trùng ở tầng database — vững chắc hơn kiểm tra code
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
```

### 8.4. escapeRegex chống ReDoS
```javascript
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const searchRegex = new RegExp(escapeRegex(query.trim()), 'i');
```

### 8.5. Validation capacity khi update
```javascript
// Admin không được set capacity thấp hơn enrolledCount hiện tại
if (updateData.capacity && updateData.capacity < course.enrolledCount) {
  return res.status(400).json({
    success: false,
    message: `Capacity không thể thấp hơn số học viên đã ghi danh (${course.enrolledCount})`
  });
}
```

---

*Tài liệu này là bản kế hoạch tổng thể. Mỗi phase nên được commit riêng biệt theo Conventional Commits.*
