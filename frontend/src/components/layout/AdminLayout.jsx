import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiBookOpen, FiUsers, FiLogOut, FiArrowLeft, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất tài khoản Quản trị');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: FiGrid },
    { label: 'Quản lý Khóa học', path: '/admin/courses', icon: FiBookOpen },
    { label: 'Danh sách Ghi danh', path: '/admin/enrollments', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Admin Top Header */}
      <header className="bg-slate-800 border-b border-slate-700 h-16 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
                <FiShield />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">PKS Admin Portal</span>
            </Link>

            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/50 px-2.5 py-1 rounded-md transition-colors ml-2"
            >
              <FiArrowLeft /> Về trang Student
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{user?.fullName}</p>
              <p className="text-[10px] text-purple-400 uppercase font-medium">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Đăng xuất Admin"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Bar */}
      <div className="bg-slate-800/60 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
        {children}
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        PKS Admin Control Panel — Internal Administrative Interface
      </footer>
    </div>
  );
};

export default AdminLayout;
