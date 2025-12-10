import { isArray, mergeWith } from 'lodash';

export const deepMerge = <TObject, TSource>(object: TObject, source: TSource) => {
  return mergeWith(object, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
};

export const parseJson = <T>(json: string, defaultJson?: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('parseJson error', error);
    return defaultJson;
  }
};
