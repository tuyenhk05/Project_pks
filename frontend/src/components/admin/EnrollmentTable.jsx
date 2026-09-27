import React from 'react';
import { formatDate } from '../../utils/formatters';

const EnrollmentTable = ({ enrollments }) => {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Chưa có lượt ghi danh nào.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Học viên</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Khóa học</th>
            <th className="py-3 px-4">Ngày ghi danh</th>
            <th className="py-3 px-4">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {enrollments.map((item, index) => {
            const user = item.userId;
            const course = item.courseId;

            return (
              <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-bold text-slate-800">
                  {user?.fullName || 'N/A'}
                </td>
                <td className="py-3 px-4 text-slate-500">{user?.email || 'N/A'}</td>
                <td className="py-3 px-4 font-semibold text-sky-600">
                  {course?.title || 'N/A'}
                </td>
                <td className="py-3 px-4 font-medium text-slate-600">
                  {formatDate(item.enrolledAt)}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                    {item.status || 'enrolled'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentTable;
