# PKS Course & Enrollment Portal

> Mini web-app quản lý và ghi danh các khóa học công nghệ.

## 📋 Giới thiệu

Hệ thống **PKS Course & Enrollment Portal** phục vụ tra cứu, quản lý và ghi danh các khóa học công nghệ. Gồm 2 vai trò chính:
- **Student (Học viên)**: Đăng ký tài khoản, xem khóa học, ghi danh, quản lý khóa học đã đăng ký
- **Admin/Staff (Quản trị)**: Quản lý khóa học CRUD, quản lý danh sách ghi danh

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- MongoDB Atlas account hoặc MongoDB local
- Git

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Cấu hình DATABASE_URI, JWT_SECRET
npm run seed            # Tạo dữ liệu mẫu
npm run dev             # Chạy server (http://localhost:3000)
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Cấu hình VITE_API_URL
npm run dev             # Chạy client (http://localhost:5173)
```

## 👤 Tài khoản Demo

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@pks.edu.vn | Admin@123 |
| Student | student@pks.edu.vn | Student@123 |

## 📡 API Endpoints

### Student API (`/api/v1`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /auth/register | Đăng ký |
| POST | /auth/login | Đăng nhập |
| GET | /auth/me | Thông tin cá nhân |
| GET | /courses | Danh sách khóa học |
| GET | /courses/:id | Chi tiết khóa học |
| POST | /enrollments | Ghi danh |
| GET | /enrollments/my-courses | Khóa học đã đăng ký |

### Admin API (`/admin`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /auth/login | Đăng nhập Admin |
| GET/POST | /courses | Xem/Tạo khóa học |
| PUT/DELETE | /courses/:id | Sửa/Xóa khóa học |
| GET | /enrollments | Tất cả ghi danh |
| GET | /enrollments/course/:id | Ghi danh theo khóa |

## 📂 Cấu trúc Dự án

```
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── configs/       # DB config, seed data
│   │   ├── controllers/   # Admin + Client controllers
│   │   ├── middlewares/    # Auth, validation, error handler
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # JWT, regex helpers
│   │   └── validations/   # Joi schemas
│   └── server.js
├── frontend/          # React.js + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Admin + Client pages
│   │   ├── services/      # API service layer
│   │   ├── store/         # Auth context
│   │   └── utils/         # HTTP client, formatters
│   └── vite.config.js
└── docs/              # ERD, Postman, Screenshots
```

## 🔒 Bảo mật
- Password hash: bcrypt (salt >= 10)
- JWT authentication với expiration
- RBAC: Tách biệt Student/Admin routes
- IDOR prevention: userId từ JWT token
- Race Condition: Atomic Update cho enrollment
- Input validation: Joi schemas
- CORS whitelist, Helmet headers, Rate limiting

## 📊 ERD
![ERD](docs/ERD.png)
