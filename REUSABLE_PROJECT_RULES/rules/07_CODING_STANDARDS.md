# 📝 Quy chuẩn 07: Tiêu chuẩn Code & API — PKS Course Portal

---

## 🤝 1. Chuẩn Response API

**MỌI endpoint BẮT BUỘC trả JSON theo format sau:**

### Thành công:
```json
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
```

### Thất bại:
```json
{
  "success": false,
  "message": "Email đã tồn tại trong hệ thống"
}
```

### Helper function:
```javascript
// helpers/response.helper.js
const sendSuccess = (res, statusCode, message, data = null, pagination = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};
```

---

## 🚦 2. HTTP Status Codes

| Code | Tên | Khi nào dùng |
|------|-----|-------------|
| `200` | OK | GET, PUT, PATCH, DELETE thành công |
| `201` | Created | POST tạo mới thành công (register, create course, enroll) |
| `400` | Bad Request | Input sai, email trùng, khóa học hết chỗ, ghi danh trùng |
| `401` | Unauthorized | Chưa đăng nhập, token sai/hết hạn |
| `403` | Forbidden | Đã đăng nhập nhưng không đủ quyền (student vào admin API) |
| `404` | Not Found | Khóa học không tồn tại, user không tìm thấy |
| `500` | Server Error | Lỗi server bất ngờ |

---

## 💻 3. Naming Conventions

| Loại | Quy chuẩn | Ví dụ |
|------|-----------|-------|
| Biến, hàm | camelCase | `getCourseById`, `enrolledCount` |
| Component, Class | PascalCase | `CourseCard`, `AdminLayout` |
| Hằng số, ENV | UPPER_SNAKE_CASE | `JWT_SECRET`, `MAX_CAPACITY` |
| File API/Backend | kebab hoặc dot | `courses.controller.js` |
| URL path | kebab-case | `/api/v1/my-courses` |
| Thư mục | lowercase | `controllers/`, `middlewares/` |

---

## 🔄 4. Conventional Commits (Yêu cầu đề bài)

| Prefix | Khi nào dùng | Ví dụ |
|--------|-------------|-------|
| `feat:` | Thêm tính năng mới | `feat: implement course enrollment API` |
| `fix:` | Sửa lỗi | `fix: handle duplicate enrollment error` |
| `chore:` | Cấu hình, setup | `chore: setup backend with Express and MongoDB` |
| `refactor:` | Tái cấu trúc | `refactor: extract pagination helper` |
| `docs:` | Tài liệu | `docs: add README with setup instructions` |
| `test:` | Thêm test | `test: add Postman collection for auth flow` |
| `style:` | Format code | `style: fix indentation in controllers` |

### Lưu ý Git quan trọng:
- **KHÔNG bulk dump** toàn bộ source trong 1 commit
- Mỗi feature/fix 1 commit riêng
- Nên có **>= 10 commits** trong history
- **KHÔNG commit** `.env` hay `node_modules/`

---

## 🔄 5. Query Optimization

### Lean Queries (Read-Only):
```javascript
// Khi chỉ đọc dữ liệu, dùng .lean() để bỏ overhead Mongoose
const courses = await Course.find({ status: 'active' })
  .select('title category instructor tuitionFee capacity enrolledCount')
  .lean();
```

### Pagination Pattern:
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [courses, total] = await Promise.all([
  Course.find(filter).skip(skip).limit(limit).lean(),
  Course.countDocuments(filter)
]);

const pagination = {
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalItems: total,
  limit
};
```

---

## 🚫 6. Các Hành Vi Cấm

| # | ❌ Cấm | ✅ Thay thế |
|---|--------|-----------|
| 1 | `catch (e) {}` rỗng | Log lỗi hoặc trả response lỗi |
| 2 | Tin cậy giá từ client | Tính toán phía server từ DB |
| 3 | `new RegExp(userInput)` không escape | Dùng `escapeRegex(userInput)` |
| 4 | `axios.get()` trong Component | Gọi qua Service function |
| 5 | Magic numbers/strings | Dùng constants hoặc enum |
| 6 | Hardcode URL / Secret | Đọc từ `.env` |
| 7 | `console.log` thừa trong production | Xóa trước khi submit |
| 8 | `alert()` cho thông báo | Dùng Toast notification |

---

*Clean code + Conventional Commits giúp đạt điểm cao ở hạng mục Git & Clean Code (1.5đ).*
