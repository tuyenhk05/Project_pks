# 🛠️ Skill: Thêm Module Chức năng Mới — PKS Course Portal

---

## 📋 Quy trình 7 bước

```text
[Bước 1] DB Model ──► [Bước 2] BE Admin Controller ──► [Bước 3] BE Client Controller
                              │                                │
                              ▼                                ▼
                        [Bước 4] BE Routes (Admin & Client) + Middleware
                              │
                              ▼
                        [Bước 5] FE API Services (admin/ & client/)
                              │
                              ▼
                        [Bước 6] FE Pages & UI Components
                              │
                              ▼
                        [Bước 7] Đăng ký vào React Router (AppRoutes.jsx)
```

---

## 📑 Chi tiết từng bước

### 🔹 Bước 1: Tạo Mongoose Model
- **File**: `backend/src/models/[entities].model.js`
- Khai báo Schema với kiểu dữ liệu chặt chẽ (`required`, `unique`, `enum`, `default`)
- Bật `timestamps: true`
- Thêm index nếu cần (unique, compound)

### 🔹 Bước 2: Tạo Admin Controller
- **File**: `backend/src/controllers/admin/[entity].controller.js`
- CRUD đầy đủ: list, create, update, delete
- Dùng `sendSuccess()` / `sendError()` helper

### 🔹 Bước 3: Tạo Client Controller
- **File**: `backend/src/controllers/client/[entity].controller.js`
- Chỉ các tương tác của Student (xem, tạo cá nhân)
- Lấy `userId` từ `req.user.id` (chống IDOR)

### 🔹 Bước 4: Khai báo Routes + Middleware
- **Admin**: `backend/src/routes/admin/[entity].route.js`
  - Gắn `authenticate` + `requireAdmin`
- **Client**: `backend/src/routes/client/[entity].route.js`
  - Gắn `authenticate` nếu cần

### 🔹 Bước 5: Tạo FE Service Layer
- **Admin**: `frontend/src/services/admin/[entity].service.js`
- **Client**: `frontend/src/services/client/[entity].service.js`
- Import từ `httpClient.js`, KHÔNG gọi axios trực tiếp

### 🔹 Bước 6: Tạo Pages & Components
- **Admin Page**: `frontend/src/pages/admin/[Entity]Management.jsx`
- **Client Page**: `frontend/src/pages/client/[Entity]Page.jsx`
- **Components**: `frontend/src/components/[admin|client]/[EntityComponent].jsx`
- Xử lý đầy đủ: Loading, Empty, Error, Disabled states

### 🔹 Bước 7: Đăng ký Router
- Thêm route vào `frontend/src/routes/AppRoutes.jsx`
- Bọc `ProtectedRoute` nếu cần auth

---

## 🛡️ Checklist chống lỗi khi thêm Module mới

| # | Kiểm tra | ☐ |
|---|---------|---|
| 1 | Model có `timestamps: true`? | ☐ |
| 2 | Admin và Client controller tách riêng? | ☐ |
| 3 | Admin routes có `authenticate` + `requireAdmin`? | ☐ |
| 4 | Client controller lấy userId từ `req.user.id`? | ☐ |
| 5 | Service layer tách admin và client? | ☐ |
| 6 | Component KHÔNG gọi axios trực tiếp? | ☐ |
| 7 | Page có xử lý Loading, Empty, Error states? | ☐ |
| 8 | Toast thay vì `alert()`? | ☐ |
| 9 | Route Frontend có ProtectedRoute? | ☐ |
| 10 | Input validation (Joi) cho API? | ☐ |

---

*Quy trình 7 bước giúp phát triển module mới nhanh chóng, nhất quán và không bỏ sót bước nào.*
