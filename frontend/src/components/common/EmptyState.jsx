import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  message = 'Không tìm thấy dữ liệu',
  description = 'Thử thay đổi bộ lọc hoặc tìm kiếm theo từ khóa khác.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl shadow-sm border border-slate-100 my-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <FiInbox className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{message}</h3>
      {description && <p className="text-slate-500 text-sm max-w-md">{description}</p>}
    </div>
  );
};

export default EmptyState;
