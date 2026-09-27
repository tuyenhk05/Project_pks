import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { FiUser, FiTag, FiUsers, FiArrowRight } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  const { _id, title, category, instructor, tuitionFee, capacity, enrolledCount, isFull, availableSlots } = course;

  return (
    <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-shadow border border-slate-200/80 flex flex-col overflow-hidden group">
      {/* Category Header Banner */}
      <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full border border-sky-400/30">
          <FiTag className="w-3 h-3" /> {category}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isFull
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {isFull ? 'Đã hết chỗ' : `Còn ${availableSlots ?? capacity - enrolledCount} suất`}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <FiUser className="w-3.5 h-3.5 text-slate-400" />
          <span>Giảng viên: <strong className="text-slate-700">{instructor}</strong></span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mt-auto mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span className="flex items-center gap-1 text-slate-500">
              <FiUsers className="w-3.5 h-3.5" /> Đã ghi danh
            </span>
            <span className="font-semibold text-slate-700">
              {enrolledCount} / {capacity}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFull ? 'bg-red-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, (enrolledCount / capacity) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Học phí</span>
            <span className="text-base font-bold text-sky-600">{formatCurrency(tuitionFee)}</span>
          </div>

          <Link
            to={`/courses/${_id}`}
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            Chi tiết <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
