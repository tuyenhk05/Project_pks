import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Guard
 * @param {string} allowedRole - 'student' or 'admin'
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner message="Đang kiểm tra quyền truy cập..." />;
  }

  if (!isLoggedIn) {
    // Redirect to appropriate login page based on target area
    const loginTarget = allowedRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRole === 'admin') {
    const isAdminRole = user?.role === 'admin' || user?.role === 'staff';
    if (!isAdminRole) {
      return <Navigate to="/" replace />;
    }
  }

  if (allowedRole === 'student' && user?.role !== 'student') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
