import React, { useState, useEffect } from 'react';
import { getCoursesService } from '../../services/client/courses.service';
import CourseCard from '../../components/client/CourseCard';
import CourseFilter from '../../components/client/CourseFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { FiChevronLeft, FiChevronRight, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCoursesService({
        search: search.trim(),
        category,
        page,
        limit: 6,
      });

      if (response?.success) {
        setCourses(response.data || []);
        setPagination(response.pagination || null);
      } else {
        setError(response?.message || 'Không thể lấy danh sách khóa học');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, category, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 sm:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-sky-400/30 mb-3">
            Hệ thống đào tạo công nghệ PKS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Khám phá khóa học & Nâng tầm Kỹ năng Lập trình
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tra cứu danh sách các khóa học Frontend, Backend, Fullstack chất lượng cao và đăng ký giữ chỗ ngay hôm nay.
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <CourseFilter
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* 4 UX States Handling */}

      {/* 1. Loading State */}
      {loading && <LoadingSpinner message="Đang tìm kiếm danh sách khóa học..." />}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl my-6 flex flex-col items-center text-center">
          <FiAlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <h4 className="font-bold text-lg mb-1">Không thể tải dữ liệu</h4>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <FiRefreshCw className="w-3.5 h-3.5" /> Thử lại
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && courses.length === 0 && (
        <EmptyState
          message="Không tìm thấy khóa học nào phù hợp"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc danh mục."
        />
      )}

      {/* 4. Success State — Course Cards Grid */}
      {!loading && !error && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 px-2">
              <p className="text-xs text-slate-500">
                Hiển thị trang <strong className="text-slate-700">{pagination.currentPage}</strong> /{' '}
                <strong className="text-slate-700">{pagination.totalPages}</strong> (Tổng {pagination.totalItems} khóa học)
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.currentPage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-xs font-semibold px-3 py-1.5 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
                  {pagination.currentPage}
                </span>

                <button
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
