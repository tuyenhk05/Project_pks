# 🎯 PKS Course & Enrollment Portal

> **Vị trí**: Thực Tập Sinh Fullstack Developer (Node.js + React.js)  
> **Ứng dụng**: Mini Web-App Tra cứu, Quản lý và Ghi danh Khóa học Công nghệ

---

## 📋 1. Giới thiệu Dự án

**PKS Course & Enrollment Portal** là giải pháp web-app quản lý và ghi danh các khóa học công nghệ dành cho 2 nhóm người dùng chính:
- 👨‍🎓 **Student (Học viên)**: Đăng ký tài khoản, đăng nhập, tìm kiếm & lọc khóa học, xem chi tiết, ghi danh khóa học (xử lý chống đè suất Race Condition) và xem danh sách khóa học của tôi.
- 👨‍💼 **Admin/Staff (Quản trị)**: Dashboard thống kê, quản lý khóa học (Thêm/Sửa/Ẩn khóa học soft-delete), xem và lọc danh sách học viên ghi danh theo khóa học.

---

## 🛠️ 2. Tech Stack

| Layer | Công nghệ Lựa chọn | Lý do sử dụng |
|-------|--------------------|---------------|
| **Backend** | Node.js + Express.js | Khởi tạo RESTful API nhanh, lightweight, kiến trúc rõ ràng |
| **Database** | MongoDB + Mongoose | CSDL linh hoạt, hỗ trợ Atomic Updates và Compound Indexes |
| **Auth & Security** | JWT + bcryptjs + Joi | Bcrypt salt 10, phân quyền RBAC, validate input chặt chẽ |
| **Frontend** | React.js + Vite | UI component-based, build siêu nhanh với Vite |
| **Styling** | Tailwind CSS | Responsive UI hiện đại, tiện lợi, tối ưu bundle size |
| **State & Router** | React Context API + React Router v6 | Quản lý state đăng nhập tập trung, Protected Routes theo Role |
| **Testing** | Postman + Node.js Native Test Runner | Postman Collection đầy đủ + 22 unit & integration test cases |

---

## 🚀 3. Hướng dẫn Cài đặt & Chạy ứng dụng

### Yêu cầu Tiền đề
- Node.js >= 18.0.0
- MongoDB Server (Local hoặc Atlas Connection String)

### Bước 1: Khởi động Backend
```bash
cd backend
npm install
cp .env.example .env     # Cấu hình PORT (3000) và DATABASE_URI
npm run seed             # Sinh dữ liệu mẫu (Admin + Student + 8 Khóa học)
npm run dev              # Chạy Backend Server tại http://localhost:3000
```

### Bước 2: Chạy bộ Kiểm thử (Unit & Integration Tests)
```bash
cd backend
npm test                 # Chạy 22 test cases tự động (Pass 100%)
```

### Bước 3: Khởi động Frontend
```bash
cd frontend
npm install
cp .env.example .env     # Cấu hình VITE_API_URL
npm run dev              # Chạy Frontend React app tại http://localhost:5173
```

---

## 🔑 4. Tài khoản Dùng thử (Demo Accounts)

| Vai trò | Email Đăng nhập | Mật khẩu | Quyền hạn |
|---------|-----------------|----------|-----------|
| **Admin** | `admin@pks.edu.vn` | `Admin@123` | Quản trị toàn bộ khóa học & danh sách ghi danh |
| **Student** | `student@pks.edu.vn` | `Student@123` | Tìm kiếm, xem chi tiết & ghi danh khóa học |

---

## 📡 5. Danh sách API Endpoints

### 🟢 Student API (`/api/v1`)
- `POST /api/v1/auth/register` - Đăng ký tài khoản Học viên mới
- `POST /api/v1/auth/login` - Đăng nhập Học viên (Trả về JWT token)
- `GET /api/v1/auth/me` - Lấy thông tin tài khoản đang đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất
- `GET /api/v1/courses` - Lấy danh sách khóa học (Tìm kiếm theo tên, Lọc danh mục, Phân trang)
- `GET /api/v1/courses/:id` - Xem chi tiết khóa học
- `POST /api/v1/enrollments` - Ghi danh vào khóa học (Xử lý Race Condition & IDOR)
- `GET /api/v1/enrollments/my-courses` - Danh sách khóa học đã ghi danh của tôi

### 🟣 Admin API (`/admin`)
- `POST /admin/auth/login` - Đăng nhập tài khoản Quản trị
- `GET /admin/courses` - Xem tất cả khóa học (bao gồm active, inactive, hidden)
- `POST /admin/courses` - Tạo mới khóa học
- `PUT /admin/courses/:id` - Cập nhật thông tin khóa học
- `DELETE /admin/courses/:id` - Soft delete (Ẩn khóa học)
- `GET /admin/enrollments` - Xem danh sách ghi danh toàn hệ thống
- `GET /admin/enrollments/course/:courseId` - Xem danh sách học viên theo khóa học

---

## 🛡️ 6. Điểm nhấn Kỹ thuật & Bảo mật

1. **Xử lý Race Condition (Đăng ký suất cuối cùng)**:
   - Sử dụng **Mongoose Atomic Update** `Course.findOneAndUpdate({ _id: courseId, status: 'active', $expr: { $lt: ['$enrolledCount', '$capacity'] } }, { $inc: { enrolledCount: 1 } })` đảm bảo sĩ số không bao giờ bị vượt quá sức chứa khi có nhiều request ghi danh đồng thời.
2. **Chặn Đăng ký Trùng ở Tầng Database**:
   - Thiết lập **Compound Unique Index** `{ userId: 1, courseId: 1 }` trong `EnrollmentSchema` chặn ghi danh trùng lặp vững chắc ở cấp độ CSDL.
3. **Phòng chống Lỗ hổng IDOR**:
   - `userId` được trích xuất trực tiếp từ JWT Token đã được xác thực (`req.user.id`), tuyệt đối không nhận `userId` từ `req.body`.
4. **Phòng chống Tấn công ReDoS**:
   - Hàm `escapeRegex` xử lý từ khóa tìm kiếm của người dùng trước khi đưa vào RegExp query.
5. **Format Ngày chuẩn ISO**:
   - Định dạng ngày hiển thị `YYYY-MM-DD` chuẩn múi giờ `Asia/Ho_Chi_Minh` bằng `Intl.DateTimeFormat('sv-SE')`.

---

## 📂 7. Cấu trúc Thư mục Dự án

```text
f:\test_pks\
├── backend/                            # NODE.JS + EXPRESS REST API
│   ├── src/
│   │   ├── configs/                    # DB connection, constants, seed data
│   │   ├── controllers/                # Admin & Client controllers
│   │   ├── helpers/                    # Response helper, pagination helper
│   │   ├── middlewares/                # Auth (JWT/RBAC), Validation, ErrorHandler
│   │   ├── models/                     # Mongoose Schemas (User, Course, Enrollment)
│   │   ├── routes/                     # API Route Definition (Admin & Client)
│   │   ├── utils/                      # JWT sign/verify, escapeRegex
│   │   └── validations/                # Joi validation schemas
│   ├── tests/                          # 22 automated test cases (npm test)
│   ├── server.js                       # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                           # REACT.JS + VITE + TAILWIND CSS
│   ├── src/
│   │   ├── components/                 # Client, Admin & Common components
│   │   ├── hooks/                      # useAuth, useFetch hooks
│   │   ├── pages/                      # Client & Admin Pages
│   │   ├── routes/                     # AppRoutes & ProtectedRoute guards
│   │   ├── services/                   # Axios API service layer
│   │   ├── store/                      # AuthContext state management
│   │   ├── utils/                      # Axios httpClient & formatters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── docs/                               # TÀI LIỆU VÀ KIỂM THỬ
    ├── ERD.md                          # Sơ đồ CSDL & Mermaid Diagram
    ├── PKS_Course_Portal.postman_collection.json # Bộ Postman collection 18+ requests
    └── screenshots/                    # Tài liệu hướng dẫn chụp ảnh kiểm thử
```

---

## 📊 8. Sơ đồ CSDL (ERD)
Xem chi tiết sơ đồ Mermaid và ràng buộc CSDL tại: [`docs/ERD.md`](docs/ERD.md)
