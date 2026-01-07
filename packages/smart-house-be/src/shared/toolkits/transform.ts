import { parseStringPromise } from 'xml2js';
import { BadRequestException } from '@nestjs/common';
import { createLogger } from '@/shared/logger';

const logger = createLogger('ObjectToolkit');
export const parseJson = <T>(jsonStr: string, options: { defaultJson?: T } = {}): T => {
  const { defaultJson } = options;
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error('parseJson error', error);
    return defaultJson;
  }
};
export const stringifyJson = (json: any): string => {
  try {
    return JSON.stringify(json);
  } catch (error) {
    logger.error('stringify Json error', error);
    return '';
  }
};
export const xml2Json = <T>(xml: string): Promise<T> => {
  try {
    return parseStringPromise(xml, {
      explicitArray: false, // 关键：不包数组
      trim: true,
    });
  } catch (error) {
    logger.error('parse xml error', error);
    throw new BadRequestException('xml格式错误');
  }
};