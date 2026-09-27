import { adminApi } from '../../utils/httpClient';

export const getAdminEnrollmentsService = async (params = {}) => {
  return await adminApi.get('/enrollments', { params });
};

export const getAdminEnrollmentsByCourseService = async (courseId) => {
  return await adminApi.get(`/enrollments/course/${courseId}`);
};
