import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiBookOpen, FiUser, FiLogOut, FiBook, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { isLoggedIn, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-sky-700 transition-colors shadow-sm">
            PKS
          </div>
          <div>
            <span className="font-bold text-slate-800 text-lg tracking-tight block leading-tight">Course Portal</span>
            <span className="text-xs text-sky-600 font-medium">Hệ thống Đăng ký Khóa học</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-slate-600 hover:text-sky-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Trang chủ
          </Link>

          {isLoggedIn && !isAdmin && (
            <Link
              to="/my-courses"
              className="flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FiBook className="w-4 h-4 text-sky-500" /> Khóa học của tôi
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 bg-purple-50 font-medium text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <FiShield className="w-4 h-4" /> Trang Quản trị
            </Link>
          )}

          {/* Auth State Badge / Action Buttons */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs border border-sky-200">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
              <Link
                to="/login"
                className="text-slate-600 hover:text-sky-600 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-4 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
