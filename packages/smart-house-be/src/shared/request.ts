import axios, { AxiosError, AxiosInstance } from 'axios';

/** 创建实例 */
export const http: AxiosInstance = axios.create({
});

/** 响应拦截 */
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error.response);
  }
);
