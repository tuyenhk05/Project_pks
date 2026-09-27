import React, { useState, useEffect } from 'react';
import { getAdminEnrollmentsService } from '../../services/admin/enrollments.service';
import { getAdminCoursesService } from '../../services/admin/courses.service';
import EnrollmentTable from '../../components/admin/EnrollmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';
import { FiFilter } from 'react-icons/fi';

const EnrollmentsManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoursesList = async () => {
    try {
      const res = await getAdminCoursesService({ limit: 100 });
      if (res?.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await getAdminEnrollmentsService({
        courseId: selectedCourseId,
        limit: 100,
      });

      if (res?.success) {
        setEnrollments(res.data || []);
      }
    } catch (err) {
      toast.error(err.message || 'Không thể tải danh sách ghi danh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesList();
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [selectedCourseId]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Ghi Danh</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Theo dõi tất cả lượt học viên ghi danh vào các khóa học công nghệ
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs w-full sm:w-auto">
          <FiFilter className="w-4 h-4 text-purple-600 ml-2" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-transparent text-slate-700 text-xs font-bold py-1.5 pr-4 focus:outline-none cursor-pointer max-w-xs truncate"
          >
            <option value="">Tất cả các khóa học</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner message="Đang tải danh sách ghi danh..." />}

      {!loading && enrollments.length === 0 && (
        <EmptyState
          message="Chưa có lượt ghi danh nào"
          description="Chưa có học viên nào ghi danh khóa học đã chọn."
        />
      )}

      {!loading && enrollments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <EnrollmentTable enrollments={enrollments} />
        </div>
      )}
    </div>
  );
};

export default EnrollmentsManagement;
