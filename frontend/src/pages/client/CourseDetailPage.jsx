import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseByIdService } from '../../services/client/courses.service';
import { getMyEnrollmentsService } from '../../services/client/enrollments.service';
import { useAuth } from '../../hooks/useAuth';
import EnrollButton from '../../components/client/EnrollButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiArrowLeft, FiUser, FiTag, FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { isLoggedIn, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCourseByIdService(id);
      if (response?.success) {
        setCourse(response.data);
      } else {
        setError(response?.message || 'Không thể tìm thấy thông tin khóa học');
      }

      // Check if student already enrolled
      if (isLoggedIn && isStudent) {
        const myEnrollmentsRes = await getMyEnrollmentsService();
        if (myEnrollmentsRes?.success && myEnrollmentsRes?.data) {
          const enrolled = myEnrollmentsRes.data.some(
            (item) => item.courseId?._id === id || item.courseId === id
          );
          setIsEnrolled(enrolled);
        }
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải chi tiết khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, isLoggedIn, isStudent]);

  if (loading) {
    return <LoadingSpinner message="Đang tải chi tiết khóa học..." />;
  }

  if (error || !course) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200 text-center max-w-lg mx-auto my-12">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Không thể xem khóa học</h3>
        <p className="text-slate-500 text-sm mb-6">{error || 'Khóa học không tồn tại'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
        >
          <FiArrowLeft /> Quay về danh sách
        </Link>
      </div>
    );
  }

  const { title, category, instructor, description, tuitionFee, capacity, enrolledCount, isFull, availableSlots, createdAt } = course;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
      >
        <FiArrowLeft /> Quay lại danh sách khóa học
      </Link>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-3 py-1 rounded-full border border-sky-200">
            <FiTag className="w-3.5 h-3.5" /> {category}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isFull
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isFull ? 'Đã hết chỗ' : `Còn ${availableSlots ?? capacity - enrolledCount} suất`}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          {title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-2xs border border-slate-200">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Giảng viên</span>
              <span className="text-sm font-bold text-slate-800">{instructor}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-2xs border border-slate-200">
              <FiUsers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sức chứa</span>
              <span className="text-sm font-bold text-slate-800">
                {enrolledCount} / {capacity} học viên
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-2xs border border-slate-200">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Ngày đăng khóa</span>
              <span className="text-sm font-bold text-slate-800">{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-800 mb-2">Mô tả khóa học</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {description || 'Chưa có thông tin mô tả chi tiết cho khóa học này.'}
          </p>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Học phí trọn gói</span>
            <span className="text-2xl font-extrabold text-sky-600">{formatCurrency(tuitionFee)}</span>
          </div>

          <EnrollButton
            courseId={id}
            isFull={isFull}
            isEnrolled={isEnrolled}
            onEnrollSuccess={fetchCourseData}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
