import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { enrollService } from '../../services/client/enrollments.service';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiCheck, FiLoader, FiLock } from 'react-icons/fi';

const EnrollButton = ({ courseId, isFull, isEnrolled, onEnrollSuccess }) => {
  const { isLoggedIn, isStudent } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast.info('Vui lòng đăng nhập để thực hiện ghi danh khóa học');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!isStudent) {
      toast.warning('Chỉ tài khoản Học viên mới có thể ghi danh khóa học');
      return;
    }

    setSubmitting(true);
    try {
      const response = await enrollService(courseId);
      if (response?.success) {
        toast.success(response.message || 'Ghi danh khóa học thành công!');
        if (onEnrollSuccess) onEnrollSuccess();
      } else {
        toast.error(response?.message || 'Ghi danh không thành công');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi ghi danh');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEnrolled) {
    return (
      <button
        disabled
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 font-bold px-6 py-3 rounded-xl cursor-not-allowed border border-emerald-200"
      >
        <FiCheck className="w-5 h-5" /> Đã ghi danh khóa học này
      </button>
    );
  }

  if (isFull) {
    return (
      <button
        disabled
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 text-slate-500 font-bold px-6 py-3 rounded-xl cursor-not-allowed border border-slate-300"
      >
        <FiLock className="w-5 h-5" /> Đã hết chỗ (Full)
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={submitting}
      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-white px-8 py-3.5 rounded-xl shadow-md transition-all ${
        submitting
          ? 'bg-sky-400 cursor-wait'
          : 'bg-sky-600 hover:bg-sky-700 active:scale-95 hover:shadow-lg'
      }`}
    >
      {submitting ? (
        <>
          <FiLoader className="w-5 h-5 animate-spin" /> Đang ghi danh...
        </>
      ) : (
        <>
          <FiCheckCircle className="w-5 h-5" /> Ghi danh ngay
        </>
      )}
    </button>
  );
};

export default EnrollButton;
