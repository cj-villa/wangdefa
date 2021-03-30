/**
 * @description: 生成 jwt 的具体工具方法
 */
import crypto from 'crypto';
import { PureObject } from 'types/global';
import { base64 } from './base64';

const HEADER = base64.encode({
  typ: 'jwt',
  alg: 'SHA256',
});

/** 生成 payload */
const makePayload = (extData: PureObject) =>
  base64.encode({
    ...extData,
    iat: Number(new Date()),
    /** 一周 */
    exp: Number(new Date()) + 604800000,
  });

/** 根据密钥生成 sign */
const makeSignature = (header: string, payload: string, secret: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(`${header}.${payload}.${secret}`);
  return hash.digest('hex');
};

/** 生成 jwt */
export const makeJWT = (secret: string, extData: PureObject) => {
  const payload = makePayload(extData);
  return `${HEADER}.${payload}.${makeSignature(HEADER, payload, secret)}`;
};

/** 教研 jwt */
export const checkJWT = (jwt: string, secret: string) => {
  const [header, payload, signature] = jwt.split('.');
  return makeSignature(header, payload, secret) === signature;
};
