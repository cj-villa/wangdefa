import { constants as cryptoConstants } from 'crypto';
import https from 'https';
import axios, { AxiosError, AxiosInstance } from 'axios';

const legacyAgent = new https.Agent({
  secureOptions: cryptoConstants.SSL_OP_LEGACY_SERVER_CONNECT,
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
