# 📸 TÀI LIỆU VÀ KẾT QUẢ KIỂM THỬ POSTMAN API

Thư mục này lưu trữ hướng dẫn và bằng chứng kiểm thử các API endpoints của hệ thống **PKS Course & Enrollment Portal**.

---

## 📂 Danh sách các Test Case kiểm thử trong Postman Collection

File Postman Collection được lưu trữ tại: [`docs/PKS_Course_Portal.postman_collection.json`](../PKS_Course_Portal.postman_collection.json)

### 1. Thư mục `1. Authentication (Student)`
| # | Tên Test Case | Method | Endpoint | HTTP Status | Mục đích |
|---|---------------|--------|----------|-------------|----------|
| 1 | Register Student - Success | POST | `/api/v1/auth/register` | `201 Created` | Đăng ký thành công học viên mới |
| 2 | Register Student - Duplicate Email | POST | `/api/v1/auth/register` | `400 Bad Request` | Bắt lỗi trùng email |
| 3 | Login Student - Success | POST | `/api/v1/auth/login` | `200 OK` | Đăng nhập học viên thành công, trả về JWT token |
| 4 | Login Student - Wrong Password | POST | `/api/v1/auth/login` | `401 Unauthorized` | Bắt lỗi sai mật khẩu |
| 5 | Get Profile Me - Authorized | GET | `/api/v1/auth/me` | `200 OK` | Lấy thông tin user đăng nhập có token |
| 6 | Get Profile Me - Unauthorized | GET | `/api/v1/auth/me` | `401 Unauthorized` | Chặn truy cập khi không có token |

### 2. Thư mục `2. Courses (Student View)`
| # | Tên Test Case | Method | Endpoint | HTTP Status | Mục đích |
|---|---------------|--------|----------|-------------|----------|
| 1 | Get All Active Courses | GET | `/api/v1/courses?page=1&limit=6` | `200 OK` | Danh sách khóa học có phân trang |
| 2 | Search Courses by Name | GET | `/api/v1/courses?search=React` | `200 OK` | Tìm kiếm theo tên (chống ReDoS) |
| 3 | Filter Courses by Category | GET | `/api/v1/courses?category=Frontend` | `200 OK` | Lọc khóa học theo danh mục |
| 4 | Get Course By ID | GET | `/api/v1/courses/:id` | `200 OK` | Lấy chi tiết khóa học theo ObjectId |

### 3. Thư mục `3. Enrollments (Student Flow)`
| # | Tên Test Case | Method | Endpoint | HTTP Status | Mục đích |
|---|---------------|--------|----------|-------------|----------|
| 1 | Enroll Course - Success | POST | `/api/v1/enrollments` | `201 Created` | Ghi danh thành công (Atomic Update) |
| 2 | Enroll Course - Duplicate Error | POST | `/api/v1/enrollments` | `400 Bad Request` | Chặn ghi danh trùng (Compound Index) |
| 3 | Get My Enrolled Courses | GET | `/api/v1/enrollments/my-courses` | `200 OK` | Danh sách khóa học đã ghi danh |

### 4. Thư mục `4. Admin Operations`
| # | Tên Test Case | Method | Endpoint | HTTP Status | Mục đích |
|---|---------------|--------|----------|-------------|----------|
| 1 | Admin Login - Success | POST | `/admin/auth/login` | `200 OK` | Đăng nhập tài khoản Admin/Staff |
| 2 | Student Forbidden on Admin API | GET | `/admin/courses` | `403 Forbidden` | Chặn tài khoản Student gọi Admin API |
| 3 | Create Course | POST | `/admin/courses` | `201 Created` | Admin tạo khóa học mới |
| 4 | Get All Admin Enrollments | GET | `/admin/enrollments` | `200 OK` | Xem danh sách tất cả lượt ghi danh |

---

## 📷 Bằng chứng hình ảnh (Screenshots Guide)
Các ảnh chụp tương ứng lưu trữ tại thư mục này:
- `auth-register.png`
- `auth-login.png`
- `courses-list.png`
- `enrollment-success.png`
- `enrollment-duplicate-error.png`
- `enrollment-full-error.png`
- `admin-crud.png`
