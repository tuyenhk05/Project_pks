# 📜 Master Project Rules — PKS Course & Enrollment Portal

**Tên dự án**: `PKS Course & Enrollment Portal`  
**Backend Stack**: `Node.js / Express`  
**Frontend Stack**: `React.js + Vite`  
**Database**: `MongoDB (Mongoose)`  

---

## 📚 Danh mục Quy chuẩn Chi tiết

| STT | File Quy chuẩn | Mô tả Trọng tâm |
|---|---|---|
| 01 | [`rules/01_FOLDER_STRUCTURE.md`](rules/01_FOLDER_STRUCTURE.md) | Cấu trúc thư mục chuẩn, phân tách Admin/Student, quy chuẩn đặt tên file. |
| 02 | [`rules/02_BACKEND_ARCHITECTURE.md`](rules/02_BACKEND_ARCHITECTURE.md) | Kiến trúc REST API, Mongoose Models, xử lý lỗi toàn cục & Race Condition. |
| 03 | [`rules/03_FRONTEND_ARCHITECTURE.md`](rules/03_FRONTEND_ARCHITECTURE.md) | Kiến trúc Frontend React, Service layer, Error Boundary & quản lý state. |
| 04 | [`rules/04_FEATURE_DECOMPOSITION.md`](rules/04_FEATURE_DECOMPOSITION.md) | Bóc tách tính năng (SRP), giới hạn độ dài file & helper extraction. |
| 05 | [`rules/05_ENVIRONMENT_CONFIG.md`](rules/05_ENVIRONMENT_CONFIG.md) | Quản lý `.env`, mẫu `.env.example`, phân tách secrets BE/FE. |
| 06 | [`rules/06_SECURITY_AND_AUTH.md`](rules/06_SECURITY_AND_AUTH.md) | JWT Auth, bcrypt, RBAC Admin/Student, chống IDOR & Race Condition. |
| 07 | [`rules/07_CODING_STANDARDS.md`](rules/07_CODING_STANDARDS.md) | Chuẩn Response API, HTTP status codes, Clean Code & Conventional Commits. |
| 🛠️ | [`skills/ADD_NEW_FEATURE_MODULE.md`](skills/ADD_NEW_FEATURE_MODULE.md) | Quy trình 7 bước phát triển Module mới End-to-End. |
| 🛠️ | [`skills/ENROLLMENT_RACE_CONDITION.md`](skills/ENROLLMENT_RACE_CONDITION.md) | Hướng dẫn xử lý Race Condition khi ghi danh suất cuối. |

---

## ⚡ 10 Nguyên Tắc Vàng Bắt Buộc

1. **Phân tách luồng Student & Admin Tuyệt đối**: Không gộp chung Controller, Route, Service hay Page giữa Admin và Student.
2. **Format Response API Chuẩn Hóa**: `{ success: boolean, message: string, data?: any, pagination?: object }`
3. **Phân quyền RBAC Chặt chẽ**: API Admin phải qua `authenticate` + `requireAdmin` middleware. Student không truy cập Admin API.
4. **Chống IDOR**: Lấy `userId` từ JWT (`req.user.id`), tuyệt đối không tin cậy `userId` từ client body.
5. **Atomic Update cho Enrollment**: Dùng `findOneAndUpdate` với `$lt` + `$inc` để chống Race Condition khi ghi danh.
6. **Phòng chống ReDoS**: Escape regex search query bằng `escapeRegex()`.
7. **Mã hóa Password**: bcrypt với salt rounds >= 10, không lưu plaintext.
8. **Không gọi HTTP trong UI Component**: Tất cả lời gọi API phải qua Service layer (`services/admin/` hoặc `services/client/`).
9. **Quản lý UX States**: Mọi trang phải xử lý Loading, Empty, Error, Disabled states. Dùng Toast, không dùng `alert()`.
10. **Không Hardcode Secrets**: Mọi secret nằm trong `.env`, có `.env.example`, không commit `.env` lên Git.

---
*Tuân thủ bộ quy chuẩn này đảm bảo hệ thống đạt điểm cao trong tất cả hạng mục đánh giá.*
