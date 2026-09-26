# 🔑 Quy chuẩn 05: Cấu hình Môi trường — PKS Course Portal

---

## 🔒 1. Quy tắc Bảo mật

1. 🚫 **KHÔNG BAO GIỜ commit file `.env` lên Git**
2. Thêm `.env` vào `.gitignore` ở cả `backend/` và `frontend/`
3. Luôn duy trì `.env.example` với giá trị mẫu (không có secret thật)

---

## 🛠️ 2. Backend Environment (`backend/.env.example`)

```env
# ===== Server =====
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ===== Database =====
DATABASE_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pks_courses?retryWrites=true&w=majority

# ===== Authentication =====
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# ===== Rate Limiting =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Biến môi trường Backend:

| Biến | Mô tả | Bắt buộc |
|------|-------|---------|
| `PORT` | Cổng server chạy | ✅ |
| `NODE_ENV` | `development` hoặc `production` | ✅ |
| `CLIENT_URL` | URL frontend để cấu hình CORS | ✅ |
| `DATABASE_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Khóa bí mật ký JWT | ✅ |
| `JWT_EXPIRES_IN` | Thời hạn JWT (ví dụ: `7d`, `24h`) | ✅ |

---

## 💻 3. Frontend Environment (`frontend/.env.example`)

```env
# ===== API URLs =====
VITE_API_URL=http://localhost:3000/api/v1
VITE_ADMIN_API_URL=http://localhost:3000/admin
```

### Lưu ý Frontend:
- Vite chỉ expose biến có prefix `VITE_` ra client
- **KHÔNG đặt secret keys** (JWT_SECRET, DATABASE_URI) vào `.env` frontend
- Truy cập trong code: `import.meta.env.VITE_API_URL`

---

## 📂 4. File `.gitignore` mẫu

### Root `.gitignore`:
```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

## 🚀 5. Cấu hình đọc `.env` trong Backend

```javascript
// Đặt ở đầu server.js
require('dotenv').config();

// Sử dụng
const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;
const JWT_SECRET = process.env.JWT_SECRET;
```

---

*Quản lý `.env` đúng cách ngăn chặn rò rỉ dữ liệu và giúp deploy mượt mà.*
