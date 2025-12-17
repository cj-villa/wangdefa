export const getIp = (request: Request) => {
  const ip =
    request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    request.headers['x-real-ip'] ||
    request.headers['cf-connecting-ip'] ||
    request.headers['true-client-ip'] ||
    (request as any).ip ||
    (request as any).socket?.remoteAddress;
  return ip === '::1' ? '127.0.0.1' : ip.replace('::ffff:', '');
};
