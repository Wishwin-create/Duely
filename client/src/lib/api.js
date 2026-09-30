import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1', withCredentials: true });

const NO_RETRY = ['/auth/login', '/auth/register', '/auth/refresh'];
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !NO_RETRY.includes(original.url)
    ) {
      original._retry = true;
      try {
        refreshing ??= api.post('/auth/refresh').finally(() => (refreshing = null));
        await refreshing;
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;