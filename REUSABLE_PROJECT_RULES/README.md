# 📦 Bộ Quy Chuẩn & Skills — PKS Course & Enrollment Portal

Bộ quy chuẩn phát triển phần mềm được tùy biến riêng cho dự án **PKS Course & Enrollment Portal**.

---

## 🎯 Tech Stack cụ thể

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs

---

## 📚 Danh mục Tài liệu

| STT | File | Mục đích |
|---|---|---|
| 📌 | [PROJECT_RULES_MASTER.md](PROJECT_RULES_MASTER.md) | File chỉ mục trung tâm & 10 nguyên tắc vàng |
| 01 | [rules/01_FOLDER_STRUCTURE.md](rules/01_FOLDER_STRUCTURE.md) | Cấu trúc thư mục Backend + Frontend |
| 02 | [rules/02_BACKEND_ARCHITECTURE.md](rules/02_BACKEND_ARCHITECTURE.md) | Kiến trúc REST API, Models, Error Handling |
| 03 | [rules/03_FRONTEND_ARCHITECTURE.md](rules/03_FRONTEND_ARCHITECTURE.md) | React Routing, State, Service Layer, UX |
| 04 | [rules/04_FEATURE_DECOMPOSITION.md](rules/04_FEATURE_DECOMPOSITION.md) | Bóc tách module, giới hạn file size |
| 05 | [rules/05_ENVIRONMENT_CONFIG.md](rules/05_ENVIRONMENT_CONFIG.md) | Quản lý .env, secrets, .gitignore |
| 06 | [rules/06_SECURITY_AND_AUTH.md](rules/06_SECURITY_AND_AUTH.md) | JWT, bcrypt, RBAC, IDOR, Race Condition |
| 07 | [rules/07_CODING_STANDARDS.md](rules/07_CODING_STANDARDS.md) | Response format, HTTP codes, Conventional Commits |
| 🛠️ | [skills/ADD_NEW_FEATURE_MODULE.md](skills/ADD_NEW_FEATURE_MODULE.md) | Quy trình 7 bước thêm Module mới |
| 🛠️ | [skills/ENROLLMENT_RACE_CONDITION.md](skills/ENROLLMENT_RACE_CONDITION.md) | Xử lý Race Condition khi ghi danh suất cuối |

---

## 🔄 Thay đổi so với template gốc

| Mục | Template gốc | Đã chỉnh sửa |
|-----|-------------|---------------|
| Tên file rules | `01_FOLDER_STRUCTURE_AND_ORGANIZATION.md` | `01_FOLDER_STRUCTURE.md` (ngắn gọn hơn) |
| Nội dung | Generic / Stack-agnostic | Cụ thể cho Node.js + React + MongoDB |
| Code examples | Chung chung | Code mẫu cụ thể cho dự án |
| Skills | 1 skill chung | 2 skills (thêm Race Condition) |
| Security | Chung chung | Cụ thể JWT + bcrypt + RBAC Admin/Student |
| Thư mục `.cursor/` | Có | Đã xóa (không dùng Cursor) |

---

*Bộ quy chuẩn này đã được tùy biến riêng cho dự án PKS Course Portal.*
