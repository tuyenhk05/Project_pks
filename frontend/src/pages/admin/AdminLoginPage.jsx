import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiShield, FiMail, FiLock, FiLogIn, FiLoader } from 'react-icons/fi';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminLogin(email, password);
      if (response?.success) {
        toast.success('Đăng nhập Quản trị thành công!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error(response?.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full text-slate-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-2xl border border-purple-500/30">
            <FiShield />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Quản Trị Hệ Thống</h2>
          <p className="text-slate-400 text-xs mt-1">
            Đăng nhập tài khoản Admin / Staff để quản lý khóa học
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Email Quản trị
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pks.edu.vn"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Đang đăng nhập...
              </>
            ) : (
              <>
                <FiLogIn className="w-4 h-4" /> Truy cập Admin
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          Demo Admin Account: <code className="text-purple-400">admin@pks.edu.vn / Admin@123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
