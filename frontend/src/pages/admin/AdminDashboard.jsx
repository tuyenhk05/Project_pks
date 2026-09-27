import React, { useState, useEffect } from 'react';
import { getAdminCoursesService } from '../../services/admin/courses.service';
import { getAdminEnrollmentsService } from '../../services/admin/enrollments.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiBookOpen, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    totalCapacity: 0,
    totalEnrolledSlots: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        getAdminCoursesService({ limit: 100 }),
        getAdminEnrollmentsService({ limit: 100 }),
      ]);

      if (coursesRes?.success && coursesRes?.data) {
        const courses = coursesRes.data;
        const totalCourses = courses.length;
        const activeCourses = courses.filter((c) => c.status === 'active').length;
        const totalCapacity = courses.reduce((acc, c) => acc + (c.capacity || 0), 0);
        const totalEnrolledSlots = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);

        setStats((prev) => ({
          ...prev,
          totalCourses,
          activeCourses,
          totalCapacity,
          totalEnrolledSlots,
        }));
      }

      if (enrollmentsRes?.success && enrollmentsRes?.data) {
        setStats((prev) => ({
          ...prev,
          totalEnrollments: enrollmentsRes.pagination?.totalItems || enrollmentsRes.data.length,
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu tổng quan..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Quản Trị</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Tổng quan số liệu khóa học và số lượng học viên ghi danh
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tổng số khóa học
            </span>
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalCourses}</span>
            <span className="text-xs text-emerald-600 block mt-1 font-semibold">
              {stats.activeCourses} khóa đang hoạt động
            </span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xl border border-sky-100">
            <FiBookOpen />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Lượt ghi danh
            </span>
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalEnrollments}</span>
            <span className="text-xs text-purple-600 block mt-1 font-semibold">
              Ghi danh thành công
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl border border-purple-100">
            <FiUsers />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tỷ lệ lấp đầy suất
            </span>
            <span className="text-3xl font-extrabold text-slate-900">
              {stats.totalCapacity > 0
                ? `${Math.round((stats.totalEnrolledSlots / stats.totalCapacity) * 100)}%`
                : '0%'}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              {stats.totalEnrolledSlots} / {stats.totalCapacity} chỗ đã kín
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl border border-emerald-100">
            <FiTrendingUp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
