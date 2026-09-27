import { clientApi } from '../../utils/httpClient';

export const getCoursesService = async (params = {}) => {
  return await clientApi.get('/courses', { params });
};

export const getCourseByIdService = async (id) => {
  return await clientApi.get(`/courses/${id}`);
};
