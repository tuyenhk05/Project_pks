import { clientApi } from '../../utils/httpClient';

export const registerService = async (fullName, email, password) => {
  return await clientApi.post('/auth/register', { fullName, email, password });
};

export const loginService = async (email, password) => {
  return await clientApi.post('/auth/login', { email, password });
};

export const getMeService = async () => {
  return await clientApi.get('/auth/me');
};

export const logoutService = async () => {
  return await clientApi.post('/auth/logout');
};
