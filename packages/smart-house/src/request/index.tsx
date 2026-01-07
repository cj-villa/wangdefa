import { request } from './request';
import type { Page } from 'src/request/type/common';

export default {
  listToken: (params: Page) => request.get('/api/token/list', { params }),
  createToken: (data: { name: string }) => request.post('/api/token/create', data),
  deleteToken: (data: { id: string }) => request.post('/api/token/delete', data),
};
