import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ClientLayout from '../components/layout/ClientLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Client Pages
import HomePage from '../pages/client/HomePage';
import CourseDetailPage from '../pages/client/CourseDetailPage';
import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';
import MyCoursesPage from '../pages/client/MyCoursesPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CoursesManagement from '../pages/admin/CoursesManagement';
import EnrollmentsManagement from '../pages/admin/EnrollmentsManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <HomePage />
          </ClientLayout>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ClientLayout>
            <CourseDetailPage />
          </ClientLayout>
        }
      />
      <Route
        path="/login"
        element={
          <ClientLayout>
            <LoginPage />
          </ClientLayout>
        }
      />
      <Route
        path="/register"
        element={
          <ClientLayout>
            <RegisterPage />
          </ClientLayout>
        }
      />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute allowedRole="student">
            <ClientLayout>
              <MyCoursesPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <CoursesManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <EnrollmentsManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
