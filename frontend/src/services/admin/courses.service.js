import { adminApi } from '../../utils/httpClient';

export const getAdminCoursesService = async (params = {}) => {
  return await adminApi.get('/courses', { params });
};

export const getAdminCourseByIdService = async (id) => {
  return await adminApi.get(`/courses/${id}`);
};

export const createCourseService = async (courseData) => {
  return await adminApi.post('/courses', courseData);
};

export const updateCourseService = async (id, courseData) => {
  return await adminApi.put(`/courses/${id}`, courseData);
};

export const deleteCourseService = async (id) => {
  return await adminApi.delete(`/courses/${id}`);
};
