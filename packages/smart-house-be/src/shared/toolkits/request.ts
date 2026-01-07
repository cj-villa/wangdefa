import { type Request } from 'express';

const getHeaderString = (item?: string | string[]): string =>
  Array.isArray(item) ? item[0] : item;

export const getIp = (request: Request) => {
  const ip =
    getHeaderString(request.headers['x-forwarded-for'])?.split(',')[0]?.trim() ||
    getHeaderString(request.headers['x-real-ip']) ||
    getHeaderString(request.headers['cf-connecting-ip']) ||
    getHeaderString(request.headers['true-client-ip']) ||
    request.ip ||
    request.socket?.remoteAddress;
  return ip === '::1' ? '127.0.0.1' : ip.replace('::ffff:', '');
};
