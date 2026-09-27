import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollmentsService } from '../../services/client/enrollments.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiBook, FiCalendar, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyEnrollmentsService();
      if (response?.success) {
        setEnrollments(response.data || []);
      } else {
        setError(response?.message || 'Không thể lấy danh sách khóa học đã ghi danh');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Khóa học của tôi
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Danh sách các khóa học công nghệ bạn đã đăng ký giữ chỗ thành công
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner message="Đang tải danh sách khóa học của bạn..." />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-semibold mb-2">{error}</p>
          <button
            onClick={fetchMyCourses}
            className="text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && enrollments.length === 0 && (
        <EmptyState
          message="Bạn chưa ghi danh khóa học nào"
          description="Hãy khám phá danh sách khóa học tại Trang chủ và đăng ký tham gia ngay hôm nay."
        />
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((item) => {
            const course = item.courseId;
            if (!course) return null;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">
                      {course.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <FiCheckCircle className="w-3.5 h-3.5" /> Đã đăng ký
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
                    {course.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-3.5 h-3.5 text-slate-400" />
                      <span>Giảng viên: <strong className="text-slate-700">{course.instructor}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ngày ghi danh: <strong className="text-slate-700">{formatDate(item.enrolledAt)}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Học phí</span>
                    <span className="text-base font-bold text-sky-600">{formatCurrency(course.tuitionFee)}</span>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold text-xs bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition-colors"
                  >
                    Xem chi tiết <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
