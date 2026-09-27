import React, { useState, useEffect } from 'react';
import {
  getAdminCoursesService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
} from '../../services/admin/courses.service';
import CourseFormModal from '../../components/admin/CourseFormModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAdminCoursesService({ search, limit: 50 });
      if (response?.success) {
        setCourses(response.data || []);
      }
    } catch (err) {
      toast.error(err.message || 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const handleCreateNew = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Bạn có chắc muốn ẩn khóa học "${course.title}"?`)) {
      try {
        const response = await deleteCourseService(course._id);
        if (response?.success) {
          toast.success('Đã ẩn khóa học thành công!');
          fetchCourses();
        }
      } catch (err) {
        toast.error(err.message || 'Xóa/Ẩn khóa học thất bại');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingCourse) {
      const response = await updateCourseService(editingCourse._id, formData);
      if (response?.success) {
        toast.success('Cập nhật khóa học thành công!');
        fetchCourses();
      }
    } else {
      const response = await createCourseService(formData);
      if (response?.success) {
        toast.success('Tạo khóa học mới thành công!');
        fetchCourses();
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Khóa Học</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Tạo mới, cập nhật thông tin và thay đổi trạng thái hiển thị của các khóa học
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" /> Thêm khóa học mới
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tên khóa học trong quản trị..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
        </div>
      </div>

      {loading && <LoadingSpinner message="Đang tải danh sách khóa học Admin..." />}

      {!loading && courses.length === 0 && (
        <EmptyState message="Không có khóa học nào" description="Thử tìm kiếm từ khóa khác hoặc bấm nút Thêm khóa học mới." />
      )}

      {!loading && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên khóa học</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Giảng viên</th>
                  <th className="py-3.5 px-4">Học phí</th>
                  <th className="py-3.5 px-4">Sức chứa</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {course.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px]">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {course.instructor}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sky-600">
                      {formatCurrency(course.tuitionFee)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {course.enrolledCount} / {course.capacity}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block font-bold px-2.5 py-0.5 rounded-full border text-[10px] ${
                          course.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : course.status === 'inactive'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Ẩn khóa học"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCourse}
      />
    </div>
  );
};

export default CoursesManagement;
