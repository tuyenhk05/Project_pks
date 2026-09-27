import React from 'react';

const LoadingSpinner = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      {message && <p className="mt-4 text-slate-600 font-medium text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
