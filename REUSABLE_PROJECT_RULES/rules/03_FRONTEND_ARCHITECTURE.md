# 🎨 Quy chuẩn 03: Kiến trúc Frontend — PKS Course Portal

---

## ⚛️ 1. Phân tầng Giao diện

```text
               App.jsx (ErrorBoundary bọc ngoài)
                       │
              React Router (AppRoutes.jsx)
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
   ClientLayout                 AdminLayout
(Navbar, Footer)           (Sidebar, Topbar)
         │                           │
   ┌─────┴─────┐               ┌─────┴─────┐
   ▼           ▼               ▼           ▼
HomePage    CourseDetail     Dashboard    CourseMgmt
LoginPage   MyCoursesPage   EnrollMgmt
RegisterPage
         │                           │
    CourseCard               CourseFormModal
    CourseFilter             EnrollmentTable
    EnrollButton
```

---

## 🛣️ 2. Routing & Protected Routes

```javascript
// routes/AppRoutes.jsx
<Routes>
  {/* ===== PUBLIC ===== */}
  <Route element={<ClientLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses/:id" element={<CourseDetailPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Route>

  {/* ===== STUDENT PROTECTED ===== */}
  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
    <Route element={<ClientLayout />}>
      <Route path="/my-courses" element={<MyCoursesPage />} />
    </Route>
  </Route>

  {/* ===== ADMIN ===== */}
  <Route path="/admin/login" element={<AdminLoginPage />} />
  <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
    <Route element={<AdminLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/courses" element={<CoursesManagement />} />
      <Route path="/admin/enrollments" element={<EnrollmentsManagement />} />
    </Route>
  </Route>
</Routes>
```

### ProtectedRoute Logic:
```javascript
// Kiểm tra isLoggedIn + role phù hợp
// Nếu chưa login → redirect /login (student) hoặc /admin/login (admin)
// Nếu sai role → redirect về trang chủ
```

---

## 🏬 3. State Management

### AuthContext (React Context API)
```javascript
// store/AuthContext.jsx
const AuthContext = createContext();

// State:
// - user: object | null
// - token: string | null
// - isLoggedIn: boolean
// - isLoading: boolean (kiểm tra token khi mount)

// Methods:
// - login(email, password) → gọi API → lưu token + user vào localStorage
// - register(fullName, email, password) → gọi API → auto login
// - logout() → xóa sạch localStorage → redirect
// - adminLogin(email, password) → gọi Admin API → lưu admin token

// Init: useEffect kiểm tra localStorage token → gọi /auth/me verify
```

### Quy tắc State:
| Loại | Dùng cho | Ví dụ |
|------|---------|-------|
| **Local State** | UI tạm thời | Modal open/close, form input, hover |
| **Context State** | Dùng chung toàn app | user, token, isLoggedIn |
| **API Response** | Dữ liệu từ server | courses list, enrollment list |

---

## 📡 4. Service Layer

**Quy tắc tuyệt đối: Component KHÔNG gọi `axios`/`fetch` trực tiếp.**

### HTTP Client Setup:
```javascript
// utils/httpClient.js
import axios from 'axios';

const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: gắn JWT token
clientApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: xử lý 401
clientApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { clientApi, adminApi };
```

### Service File Pattern:
```javascript
// services/client/courses.service.js
import { clientApi } from '../../utils/httpClient';

export const getCourses = async (params) => {
  const response = await clientApi.get('/courses', { params });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await clientApi.get(`/courses/${id}`);
  return response.data;
};
```

---

## 💎 5. Sáu Nguyên Tắc Bắt Buộc Frontend

### 1. Đăng xuất Triệt Để
```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
  setUser(null);
  setToken(null);
  navigate('/login');
};
```

### 2. ErrorBoundary Bọc Router
```javascript
// App.jsx
<ErrorBoundary>
  <AuthProvider>
    <AppRoutes />
    <ToastContainer />
  </AuthProvider>
</ErrorBoundary>
```

### 3. Loading State trong `finally`
```javascript
const fetchCourses = async () => {
  setIsLoading(true);
  try {
    const data = await getCourses(params);
    setCourses(data.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
  } finally {
    setIsLoading(false); // LUÔN tắt loading dù thành công hay lỗi
  }
};
```

### 4. Toast Notification (KHÔNG dùng `alert()`)
```javascript
import { toast } from 'react-toastify';

// Thành công
toast.success('Ghi danh thành công!');

// Lỗi
toast.error('Khóa học đã hết chỗ');
```

### 5. Disabled Button khi Submit
```javascript
<button
  onClick={handleEnroll}
  disabled={isSubmitting || course.isFull}
>
  {isSubmitting ? <Spinner /> : 'Ghi danh ngay'}
</button>
```

### 6. Responsive Layout
- Mobile: 375px+ (1 column CourseCard)
- Tablet: 768px+ (2 columns)
- Desktop: 1024px+ (3-4 columns grid)

---

*Kiến trúc Frontend mô-đun hóa giúp giao diện chạy mượt mà, dễ bảo trì.*
