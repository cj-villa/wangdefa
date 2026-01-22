import { message } from 'antd';
import axios, { AxiosError, AxiosInstance } from 'axios';

/** 默认接口域名 */
const DEFAULT_BASE_URL = 'http://localhost:8000';

/** 创建实例 */
export const request: AxiosInstance = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

function getToken(): string | null {
  return localStorage.getItem('token');
}

request.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers?.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/** 响应拦截 */
request.interceptors.response.use(
  (response) => {
    return response.data?.data ?? response.data;
  },
  (axiosError: AxiosError) => {
    const response = axiosError.response;
    if (response?.status === 401) {
      // 避免重复跳转
      if (!location.pathname.startsWith('/account')) {
        location.href = '/account';
      }
    }

    const data = (response?.data ?? {}) as any;

    const msg = Array.isArray(data.error) ? data.error[0] : data.error;

    if (msg) {
      message.error(msg, 3);
    }

    const error = new Error(msg, { cause: data.stack });
    error.stack = data.stack;
    return Promise.reject(error);
  }
);
