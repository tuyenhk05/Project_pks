# 🎯 PKS Course & Enrollment Portal

> **Vị trí**: Thực Tập Sinh Fullstack Developer (Node.js + React.js)  
> **Ứng dụng**: Mini Web-App Tra cứu, Quản lý và Ghi danh Khóa học Công nghệ  
> **Hình thức nộp**: GitHub Repository public + Link Demo  

---

## 📋 1. Giới thiệu Dự án

**PKS Course & Enrollment Portal** là giải pháp web-app quản lý và ghi danh các khóa học công nghệ dành cho 2 nhóm người dùng chính:
- 👨‍🎓 **Student (Học viên)**: Đăng ký tài khoản, đăng nhập, tìm kiếm & lọc khóa học, xem chi tiết, ghi danh khóa học (xử lý chống đè suất Race Condition) và xem danh sách khóa học của tôi.
- 👨‍💼 **Admin/Staff (Quản trị)**: Dashboard thống kê, quản lý khóa học (Thêm/Sửa/Ẩn khóa học soft-delete), xem và lọc danh sách học viên ghi danh theo khóa học.

---

## 🛠️ 2. Tech Stack

| Layer | Công nghệ Lựa chọn | Lý do sử dụng |
|---|---|---|
| **Backend** | Node.js + Express.js | Khởi tạo RESTful API nhanh, lightweight, kiến trúc phân tầng rõ ràng |
| **Database** | MongoDB + Mongoose | CSDL linh hoạt, hỗ trợ Atomic Updates và Compound Indexes |
| **Auth & Security** | JWT + bcryptjs + Joi | Bcrypt salt 10, phân quyền RBAC, validate payload chặt chẽ |
| **Frontend** | React.js + Vite | UI component-based, build siêu nhanh với Vite |
| **Styling** | Tailwind CSS | Responsive UI hiện đại, tiện lợi, tối ưu bundle size |
| **State & Router** | React Context API + React Router v6 | Quản lý state đăng nhập tập trung, Protected Routes theo Role |
| **Testing** | Postman + Node.js Native Test Runner | Postman Collection đầy đủ + 18 test cases tự động |

---

## 🔑 3. Tài khoản Dùng thử (Demo Accounts)

| Vai trò | Email Đăng nhập | Mật khẩu | Quyền hạn |
|---|---|---|---|
| **Admin** | `admin@pks.edu.vn` | `Admin@123` | Quản trị toàn bộ khóa học & danh sách ghi danh |
| **Student** | `student@pks.edu.vn` | `Student@123` | Tìm kiếm, xem chi tiết & ghi danh khóa học |

---

## 🚀 4. Hướng dẫn Chạy Local

### Yêu cầu Tiền đề
- Node.js >= 18.0.0
- MongoDB Server (Local hoặc MongoDB Atlas URI)

### Bước 1: Khởi động Backend
```bash
cd backend
npm install
cp .env.example .env     # Cấu hình PORT (3000) và DATABASE_URI
npm run seed             # Nạp dữ liệu mẫu lên database
npm run dev              # Chạy Backend Server tại http://localhost:3000
```

### Bước 2: Chạy bộ Kiểm thử Tự động (Tests)
```bash
cd backend
npm test                 # Chạy 18 test cases tự động (Pass 100%)
```

### Bước 3: Khởi động Frontend
```bash
cd frontend
npm install
cp .env.example .env     # Cấu hình VITE_API_URL
npm run dev              # Chạy Frontend React app tại http://localhost:5173
```

---

## 🌐 5. Hướng dẫn Triển khai Cloud (Deploy to Render & Vercel)

Dự án đã được cấu hình sẵn sàng 100% để deploy trực tiếp lên **Render** (Backend API) và **Vercel** (Frontend React).

### A. Triển khai Backend lên Render (Web Service)
1. Đăng nhập [render.com](https://render.com) -> Bấm **New** -> **Web Service**.
2. Kết nối với GitHub Repository của bạn.
3. Cấu hình các thông số:
   - **Name**: `pks-course-portal-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Cấu hình **Environment Variables** trên Render:
   - `NODE_ENV`: `production`
   - `DATABASE_URI`: Chuỗi kết nối MongoDB Atlas của bạn (`mongodb+srv://.../pks_courses?retryWrites=true&w=majority`)
   - `JWT_SECRET`: Chuỗi khóa bí mật JWT
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: URL Vercel của bạn (ví dụ: `https://pks-course-portal.vercel.app`)
5. Bấm **Deploy Web Service**. Render sẽ cung cấp URL API của bạn (ví dụ: `https://pks-course-portal-backend.onrender.com`).

---

### B. Triển khai Frontend lên Vercel
Dự án đã có tệp [frontend/vercel.json](frontend/vercel.json) cấu hình rewrite rules để không bị lỗi 404 khi người dùng refresh các trang con (`/courses/:id`, `/my-courses`, `/admin/dashboard`...).

1. Đăng nhập [vercel.com](https://vercel.com) -> Bấm **Add New** -> **Project**.
2. Chọn GitHub Repository của bạn.
3. Cấu hình:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Thêm **Environment Variables** trên Vercel:
   - `VITE_API_URL`: `https://<ten-backend-cua-ban>.onrender.com/api/v1`
   - `VITE_ADMIN_API_URL`: `https://<ten-backend-cua-ban>.onrender.com/admin`
5. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp domain demo public.

---

## 📡 6. Danh sách API Endpoints

### 🟢 Student API (`/api/v1`)
- `POST /api/v1/auth/register` - Đăng ký tài khoản Học viên mới
- `POST /api/v1/auth/login` - Đăng nhập Học viên (Trả về JWT token)
- `GET /api/v1/auth/me` - Lấy thông tin tài khoản đang đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất
- `GET /api/v1/courses` - Lấy danh sách khóa học (Tìm kiếm theo tên, Lọc danh mục, Phân trang)
- `GET /api/v1/courses/:id` - Xem chi tiết khóa học
- `POST /api/v1/enrollments` - Ghi danh vào khóa học (Xử lý Race Condition & Chống IDOR)
- `GET /api/v1/enrollments/my-courses` - Danh sách khóa học đã ghi danh của tôi

### 🟣 Admin API (`/admin`)
- `POST /admin/auth/login` - Đăng nhập tài khoản Quản trị
- `GET /admin/courses` - Xem tất cả khóa học (bao gồm active, inactive, hidden)
- `POST /admin/courses` - Tạo mới khóa học
- `PUT /admin/courses/:id` - Cập nhật thông tin khóa học (Validate capacity >= enrolledCount)
- `DELETE /admin/courses/:id` - Soft delete (Ẩn khóa học)
- `GET /admin/enrollments` - Xem danh sách ghi danh toàn hệ thống
- `GET /admin/enrollments/course/:courseId` - Xem danh sách học viên theo khóa học

---

## 🛡️ 7. Điểm nhấn Kỹ thuật & Bảo mật

1. **Xử lý Race Condition khi ghi danh suất cuối**:
   - Sử dụng **Mongoose Atomic Update**:
     ```javascript
     Course.findOneAndUpdate(
       { _id: courseId, status: 'active', $expr: { $lt: ['$enrolledCount', '$capacity'] } },
       { $inc: { enrolledCount: 1 } },
       { new: true, runValidators: true }
     )
     ```
   - Đảm bảo sĩ số không bao giờ vượt quá sức chứa khi có nhiều lượt ghi danh đồng thời.
2. **Chặn ghi danh trùng lặp ở tầng Database**:
   - Thiết lập **Compound Unique Index** `{ userId: 1, courseId: 1 }` trong `EnrollmentSchema` chặn triệt để ghi danh trùng lặp.
3. **Phòng chống Lỗ hổng IDOR**:
   - `userId` được trích xuất trực tiếp từ JWT Token đã được xác thực (`req.user._id`), tuyệt đối không nhận `userId` từ body hay query client.
4. **Phòng chống Tấn công ReDoS**:
   - Hàm `escapeRegex` làm sạch từ khóa tìm kiếm của người dùng trước khi đưa vào RegExp query.
5. **Format Ngày & Tiền tệ**:
   - Định dạng ngày `YYYY-MM-DD` chuẩn múi giờ `Asia/Ho_Chi_Minh` bằng `Intl.DateTimeFormat('sv-SE')`.
   - Định dạng tiền tệ VND chuẩn (`1.500.000 ₫`).

---

## 📸 8. Tài liệu & Bằng chứng Kiểm thử (Postman & Unit Test)

- File Postman Collection: [`docs/PKS_Course_Portal.postman_collection.json`](docs/PKS_Course_Portal.postman_collection.json)
- Sơ đồ CSDL & Mermaid Diagram: [`docs/ERD.md`](docs/ERD.md)
- Bằng chứng kiểm thử màn hình nằm tại [`docs/screenshots/`](docs/screenshots/):
  - [Đăng ký Học viên mới](docs/screenshots/auth-register.png)
  - [Lỗi đăng ký trùng email](docs/screenshots/auth-duplicate-error.png)
  - [Đăng nhập Học viên thành công](docs/screenshots/auth-login.png)
  - [Lỗi đăng nhập sai mật khẩu](docs/screenshots/auth-login-wrong-pass.png)
  - [Danh sách khóa học (Phân trang, Lọc)](docs/screenshots/courses-list.png)
  - [Lỗi ghi danh trùng lặp](docs/screenshots/enrollment-duplicate-error.png)
  - [Admin CRUD Khóa học](docs/screenshots/admin-crud.png)
  - [Chặn quyền Student vào Admin API (403)](docs/screenshots/admin-forbidden-error.png)
  - [Kết quả chạy 18 Unit & Integration Tests tự động](docs/screenshots/unit-test-results.png)
