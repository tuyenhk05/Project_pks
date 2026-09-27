import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['Tất cả', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'Data Science', 'Testing'];

const CourseFilter = ({ search, setSearch, category, setCategory, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên khóa học..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Select Filter */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
          <FiFilter className="w-3.5 h-3.5 text-sky-500" />
          <span>Danh mục:</span>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat === 'Tất cả' ? '' : cat}>
              {cat}
            </option>
          ))}
        </select>

        {(search || category) && (
          <button
            onClick={onReset}
            className="text-xs text-sky-600 hover:text-sky-700 font-semibold px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors whitespace-nowrap"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseFilter;
