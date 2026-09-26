# 📁 Quy chuẩn 01: Cấu trúc Thư mục — PKS Course Portal

---

## 🏗️ 1. Tổng quan Cấu trúc Dự án

```text
pks-course-portal/
├── backend/                    # Node.js + Express API Server
├── frontend/                   # React.js + Vite Client
├── docs/                       # ERD, Postman Collection, Screenshots
├── REUSABLE_PROJECT_RULES/     # Bộ quy chuẩn & skills
├── .gitignore
├── DEVELOPMENT_PLAN.md
└── README.md
```

---

## 📂 2. Cấu trúc Backend (`backend/`)

```text
backend/
├── src/
│   ├── configs/
│   │   ├── database.js             # Kết nối MongoDB (mongoose.connect)
│   │   ├── constants.js            # ROLES enum, STATUS enum, PAGINATION defaults
│   │   └── seed.js                 # Tạo dữ liệu mẫu (Admin + Student + Courses)
│   │
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── auth.controller.js      # Admin login
│   │   │   ├── courses.controller.js   # CRUD courses (Admin)
│   │   │   └── enrollments.controller.js # Xem danh sách ghi danh
│   │   └── client/
│   │       ├── auth.controller.js      # Register / Login / Logout / GetMe
│   │       ├── courses.controller.js   # Xem danh sách + chi tiết courses
│   │       └── enrollments.controller.js # Ghi danh + My courses
│   │
│   ├── helpers/
│   │   ├── pagination.helper.js    # getPagination(page, limit, total)
│   │   └── response.helper.js      # sendSuccess(), sendError()
│   │
│   ├── middlewares/                # Số nhiều: middlewareS (chuẩn chính tả)
│   │   ├── auth.middleware.js      # authenticate, requireAdmin, requireStudent
│   │   ├── validate.middleware.js  # Joi validation middleware
│   │   └── errorHandler.middleware.js # Global error handler
│   │
│   ├── models/
│   │   ├── users.model.js          # User schema + bcrypt pre-save
│   │   ├── courses.model.js        # Course schema + virtuals
│   │   └── enrollments.model.js    # Enrollment schema + compound unique index
│   │
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── auth.route.js
│   │   │   ├── courses.route.js
│   │   │   └── enrollments.route.js
│   │   ├── client/
│   │   │   ├── auth.route.js
│   │   │   ├── courses.route.js
│   │   │   └── enrollments.route.js
│   │   └── index.js                # Mount tất cả routes vào app
│   │
│   ├── utils/                      # Chuẩn chính tả: utilS (không phải untils)
│   │   ├── jwt.util.js             # signToken(payload), verifyToken(token)
│   │   └── regex.util.js           # escapeRegex(str) chống ReDoS
│   │
│   └── validations/
│       ├── auth.validation.js      # registerSchema, loginSchema
│       └── course.validation.js    # createCourseSchema, updateCourseSchema
│
├── server.js                       # Entry point
├── .env.example
├── .gitignore
└── package.json
```

### 🚨 Quy tắc Backend:
1. **Chính tả**: `middlewares/` (số nhiều), `utils/` (KHÔNG phải `untils/`)
2. **Controller & Route**: Luôn tách `admin/` và `client/` — KHÔNG viết chung
3. **Client Routes**: Chỉ có `GET` cho courses (công khai) + `POST` enrollment + auth. KHÔNG có `PUT/DELETE` cho courses
4. **Model**: Tên file số nhiều: `users.model.js`, `courses.model.js`, `enrollments.model.js`

---

## 📂 3. Cấu trúc Frontend (`frontend/`)

```text
frontend/
├── src/
│   ├── assets/                     # Logo, ảnh, icons
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CourseFormModal.jsx      # Modal tạo/sửa khóa học
│   │   │   └── EnrollmentTable.jsx     # Bảng học viên đã ghi danh
│   │   ├── client/
│   │   │   ├── CourseCard.jsx           # Card hiển thị 1 khóa học
│   │   │   ├── CourseFilter.jsx         # Search + Filter danh mục
│   │   │   └── EnrollButton.jsx         # Nút ghi danh (có disabled state)
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx        # Bắt crash → fallback UI
│   │   │   ├── LoadingSpinner.jsx       # Spinner khi loading
│   │   │   ├── EmptyState.jsx           # Hiển thị khi không có dữ liệu
│   │   │   └── ProtectedRoute.jsx       # Guard route theo role
│   │   └── layout/
│   │       ├── ClientLayout.jsx         # Header + Footer cho Student
│   │       ├── AdminLayout.jsx          # Sidebar + Topbar cho Admin
│   │       └── Navbar.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CoursesManagement.jsx
│   │   │   └── EnrollmentsManagement.jsx
│   │   └── client/
│   │       ├── HomePage.jsx
│   │       ├── CourseDetailPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       └── MyCoursesPage.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   ├── admin/
│   │   │   ├── auth.service.js
│   │   │   ├── courses.service.js
│   │   │   └── enrollments.service.js
│   │   └── client/
│   │       ├── auth.service.js
│   │       ├── courses.service.js
│   │       └── enrollments.service.js
│   │
│   ├── store/
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   ├── httpClient.js               # Axios instances + interceptors
│   │   └── formatters.js               # formatDate, formatCurrency
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 🚨 Quy tắc Frontend:
1. **Chính tả**: `utils/` (KHÔNG phải `untils/`)
2. **Service Layer**: Component KHÔNG gọi `axios` trực tiếp. Tất cả qua `services/`
3. **Tách Service**: `services/admin/` riêng, `services/client/` riêng
4. **Pages vs Components**: `pages/` = trang gắn router URL. `components/` = mảnh UI tái sử dụng
5. **ErrorBoundary**: Bắt buộc bọc quanh Router

---

## 🏷️ 4. Quy chuẩn Đặt tên File

| Loại File | Quy chuẩn | Ví dụ |
|---|---|---|
| BE Controller | `[entity].controller.js` | `courses.controller.js` |
| BE Model | `[entity_plural].model.js` | `users.model.js` |
| BE Route | `[entity].route.js` | `courses.route.js` |
| BE Validation | `[entity].validation.js` | `auth.validation.js` |
| FE Component | `PascalCase.jsx` | `CourseCard.jsx` |
| FE Page | `PascalCase.jsx` | `CoursesManagement.jsx` |
| FE Service | `[entity].service.js` | `courses.service.js` |
| FE Hook | `use[Name].js` | `useAuth.js` |

---

## 🚫 5. Anti-Patterns (Tránh)

| ❌ Sai | ✅ Đúng | Hậu quả nếu sai |
|--------|---------|-----------------|
| Tạo `untils/` | Dùng `utils/` | Lỗi chính tả lan khắp imports |
| Gộp Admin + Student controller | Tách `admin/` và `client/` | Phân quyền lỏng lẻo |
| `axios.get()` trong JSX | Gọi qua Service | Không tái sử dụng, khó mock test |
| Client route có `DELETE /courses` | Chỉ Admin mới có CRUD | Student xóa được khóa học |
