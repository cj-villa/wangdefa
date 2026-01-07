import { isArray, mergeWith } from 'lodash';

export const deepMerge = <TObject, TSource>(object: TObject, source: TSource) => {
  return mergeWith(object, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
};
