import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle API fetch requests with loading, error, and data states
 */
export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction();
      if (response?.success) {
        setData(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response?.message || 'Không thể lấy dữ liệu');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, pagination, loading, error, refetch: execute };
};
