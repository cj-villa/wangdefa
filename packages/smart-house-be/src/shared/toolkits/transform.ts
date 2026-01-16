import { parseStringPromise } from 'xml2js';
import { BadRequestException } from '@nestjs/common';

export const parseJson = <T>(jsonStr: string, options: { defaultJson?: T } = {}): T => {
  const { defaultJson } = options;
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('parseJson error', error);
    return defaultJson;
  }
};
export const stringifyJson = (json: any, defaultText = ''): string => {
  try {
    return JSON.stringify(json);
  } catch (error) {
    console.error('stringify Json error', error);
    return defaultText;
  }
};
export const xml2Json = <T>(xml: string): Promise<T> => {
  try {
    return parseStringPromise(xml, {
      explicitArray: false, // 关键：不包数组
      trim: true,
    });
  } catch (error) {
    console.error('parse xml error', error);
    throw new BadRequestException('xml格式错误');
  }
};
