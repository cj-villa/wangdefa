import { keyBy } from 'lodash';

export const batchKeys = (record: any[], key: string) => {
  const keys = new Set();
  record.forEach((item) => {
    keys.add(item[key]);
  });
  return [...keys];
};

export const mergeEntity = (
  record: any[],
  target: any[],
  recordKey: [string, string],
  targetKey: string
) => {
  const recordMap = keyBy(target, targetKey);
  const [recordMatchKey, recordTargetKey] = recordKey;
  record.forEach((item) => {
    item[recordTargetKey] = recordMap[item[recordMatchKey]];
  });
  return record;
};
