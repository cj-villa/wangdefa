import { PureObject } from 'types/global';

interface IDecodeOptions {
  type?: 'json';
}

export const base64 = {
  encode(target: string | PureObject = '') {
    const encodeString = typeof target === 'string' ? target : JSON.stringify(target);
    return Buffer.from(encodeString).toString('base64');
  },
  decode(
    target = '',
    options: IDecodeOptions = {
      type: 'json',
    }
  ) {
    const decodeString = Buffer.from(target, 'base64').toString('ascii');
    return options?.type === 'json' ? JSON.parse(decodeString) : decodeString;
  },
};

export default base64;
