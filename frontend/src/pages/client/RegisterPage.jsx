import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus, FiLoader } from 'react-icons/fi';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('Vui lòng điền đầy đủ các thông tin yêu cầu');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    setSubmitting(true);
    try {
      const response = await register(fullName, email, password);
      if (response?.success) {
        toast.success('Đăng ký tài khoản thành công!');
        navigate('/', { replace: true });
      } else {
        toast.error(response?.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-100 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            PKS
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Đăng ký Tài khoản</h2>
          <p className="text-slate-500 text-xs mt-1">
            Tạo tài khoản Học viên mới để ghi danh các khóa học công nghệ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hocvien@pks.edu.vn"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Mật khẩu (Tối thiểu 6 ký tự)
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Đang tạo tài khoản...
              </>
            ) : (
              <>
                <FiUserPlus className="w-4 h-4" /> Đăng ký ngay
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
