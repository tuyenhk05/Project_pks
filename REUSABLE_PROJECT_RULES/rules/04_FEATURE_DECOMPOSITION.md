# 🧩 Quy chuẩn 04: Chia nhỏ File & Module — PKS Course Portal

---

## 🎯 1. Nguyên tắc Đơn Trách nhiệm (SRP)

Mỗi file chỉ đảm nhận **một vai trò duy nhất**:

| Vai trò | Mô tả | Ví dụ |
|---------|-------|-------|
| **Model** | Định nghĩa Schema CSDL | `courses.model.js` |
| **Controller** | Nhận request → gọi logic → trả response | `courses.controller.js` |
| **Route** | Khai báo URL endpoints + gắn middleware | `courses.route.js` |
| **Validation** | Kiểm tra input data | `course.validation.js` |
| **Service** | Logic phức tạp | Nếu cần tách |
| **Component** | Render UI + tương tác | `CourseCard.jsx` |
| **Page** | Trang đầy đủ gắn router | `HomePage.jsx` |

---

## 📐 2. Ma trận Module cho Dự án

```text
                          Course Feature
                                │
        ┌───────────────────────┴──────────────────────┐
        ▼                                              ▼
Backend (BE)                                    Frontend (FE)
  ├── models/courses.model.js                   ├── services/
  ├── controllers/                              │   ├── client/courses.service.js
  │   ├── client/courses.controller.js          │   └── admin/courses.service.js
  │   └── admin/courses.controller.js           ├── pages/
  ├── routes/                                   │   ├── client/HomePage.jsx
  │   ├── client/courses.route.js               │   ├── client/CourseDetailPage.jsx
  │   └── admin/courses.route.js                │   └── admin/CoursesManagement.jsx
  └── validations/course.validation.js          └── components/
                                                    ├── client/CourseCard.jsx
                                                    ├── client/CourseFilter.jsx
                                                    └── admin/CourseFormModal.jsx
```

```text
                        Enrollment Feature
                                │
        ┌───────────────────────┴──────────────────────┐
        ▼                                              ▼
Backend (BE)                                    Frontend (FE)
  ├── models/enrollments.model.js               ├── services/
  ├── controllers/                              │   ├── client/enrollments.service.js
  │   ├── client/enrollments.controller.js      │   └── admin/enrollments.service.js
  │   └── admin/enrollments.controller.js       ├── pages/
  ├── routes/                                   │   ├── client/MyCoursesPage.jsx
  │   ├── client/enrollments.route.js           │   └── admin/EnrollmentsManagement.jsx
  │   └── admin/enrollments.route.js            └── components/
  └── (validation nếu cần)                         ├── client/EnrollButton.jsx
                                                    └── admin/EnrollmentTable.jsx
```

---

## 📏 3. Giới hạn Kích thước File

| Loại file | Giới hạn | Hành động nếu vượt |
|-----------|---------|-------------------|
| FE Component / Page | ≤ 300 dòng | Tách sub-components (Modal, Table, Form) |
| BE Controller | ≤ 400 dòng | Tách logic vào `services/` hoặc `helpers/` |
| BE Model / Schema | ≤ 200 dòng | Tách virtuals, methods ra file riêng nếu cần |

---

## 🛠️ 4. Shared Helpers

Nếu logic dùng ở **≥ 2 nơi** → bắt buộc tách thành helper:

| Helper | Đặt tại | Dùng ở |
|--------|---------|--------|
| `escapeRegex(str)` | `utils/regex.util.js` | Search courses (client + admin) |
| `getPagination()` | `helpers/pagination.helper.js` | Mọi API list |
| `sendSuccess()`/`sendError()` | `helpers/response.helper.js` | Mọi controller |
| `formatDate()` | FE `utils/formatters.js` | MyCoursesPage, EnrollmentTable |
| `signToken()` | `utils/jwt.util.js` | Auth controllers |

---

## 🚫 5. Anti-Patterns

1. ❌ Gộp Admin và Student UI trong cùng 1 file Component
2. ❌ Gộp Admin và Student API trong cùng 1 file service
3. ❌ Viết query MongoDB trực tiếp trong file Route
4. ❌ Gọi `axios.get()` trong file JSX Component
5. ❌ `catch (error) {}` rỗng — phải log lỗi hoặc trả response

---

*Bóc tách module giúp code dễ đọc, dễ bảo trì và dễ phân công công việc.*
