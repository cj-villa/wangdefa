import * as crypto from 'crypto';

export const md5 = (content: string | Buffer) => {
  const hash = crypto.createHash('md5');
  hash.update(content);
  return hash.digest('hex');
};
