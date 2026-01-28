import axios, { AxiosError, AxiosInstance } from 'axios';

import https from 'https';

const legacyAgent = new https.Agent({
  secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT,
});

/** 创建实例 */
export const http: AxiosInstance = axios.create({ httpsAgent: legacyAgent });

/** 响应拦截 */
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error.response ?? error.cause);
  }
);
