import React, { createContext, useState, useEffect } from 'react';
import { loginService, registerService, getMeService } from '../services/client/auth.service';
import { adminLoginService } from '../services/admin/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and revalidate
  useEffect(() => {
    const initAuth = async () => {
      const activeToken = localStorage.getItem('token');
      if (activeToken) {
        try {
          const response = await getMeService();
          if (response?.success && response?.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Student Login
  const login = async (email, password) => {
    const response = await loginService(email, password);
    if (response?.success && response?.data) {
      const { user: userData, token: jwtToken } = response.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
    }
    return response;
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const response = await adminLoginService(email, password);
    if (response?.success && response?.data) {
      const { user: userData, token: jwtToken } = response.data;
      setUser(userData);
      setAdminToken(jwtToken);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('adminToken', jwtToken);
      localStorage.setItem('token', jwtToken);
    }
    return response;
  };

  // Student Register
  const register = async (fullName, email, password) => {
    const response = await registerService(fullName, email, password);
    if (response?.success && response?.data) {
      const { user: userData, token: jwtToken } = response.data;
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
    }
    return response;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken('');
    setAdminToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  };

  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'staff');
  const isStudent = isLoggedIn && user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        adminToken,
        isLoggedIn,
        isAdmin,
        isStudent,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
