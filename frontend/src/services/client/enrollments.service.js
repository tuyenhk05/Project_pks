import { clientApi } from '../../utils/httpClient';

export const enrollService = async (courseId) => {
  return await clientApi.post('/enrollments', { courseId });
};

export const getMyEnrollmentsService = async () => {
  return await clientApi.get('/enrollments/my-courses');
};
