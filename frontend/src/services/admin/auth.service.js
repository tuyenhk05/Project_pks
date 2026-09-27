import { adminApi } from '../../utils/httpClient';

export const adminLoginService = async (email, password) => {
  return await adminApi.post('/auth/login', { email, password });
};
