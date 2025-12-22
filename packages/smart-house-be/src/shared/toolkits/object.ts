import { isArray, mergeWith } from 'lodash';
import { BadRequestException, ConsoleLogger, UnauthorizedException } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

const logger = new ConsoleLogger('ObjectToolkit');

export const deepMerge = <TObject, TSource>(object: TObject, source: TSource) => {
  return mergeWith(object, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
};

export const parseJson = <T>(jsonStr: string, options: { defaultJson?: T } = {}): T => {
  const { defaultJson } = options;
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error('parseJson error', error);
    return defaultJson;
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
